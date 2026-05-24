import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { toast } from "@/hooks/use-toast";
import { EMAILJS_CONFIG } from "@/config/emailjs";

export type AuthMethod = "email" | "phone" | "google";
export type AuthMode = "login" | "signup" | "reset";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  password?: string;
  avatar?: string;
  bio?: string;
}

interface PendingAuth {
  email?: string;
  phone?: string;
  fullName?: string;
  password?: string;
  method: AuthMethod;
  mode: AuthMode;
  code: string;
  expiresAt: number;
}

interface AuthContextValue {
  user: UserProfile | null;
  users: UserProfile[];
  pendingAuth: PendingAuth | null;
  createAccount: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    avatar?: string;
    bio?: string;
  }) => { success: boolean; message: string };
  loginWithPassword: (email: string, password: string) => { success: boolean; message: string };
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (code: string, newPassword: string) => { success: boolean; message: string };
  updateProfile: (profile: { fullName: string; email: string; phone: string; avatar?: string; bio?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_USER_KEY = "shop.auth.user";
const AUTH_USERS_KEY = "shop.auth.users";
const AUTH_PENDING_KEY = "shop.auth.pending";

const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key: string, value: unknown | null) => {
  if (value === null) {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
};

const generateCode = () => String(Math.floor(100000 + Math.random() * 900000));

const normalizePhone = (phone: string) => phone.replace(/[^0-9+]/g, "");

const createUserProfile = (data: { fullName: string; email: string; phone: string; password?: string; avatar?: string; bio?: string }): UserProfile => ({
  id: crypto.randomUUID(),
  fullName: data.fullName,
  email: data.email,
  phone: normalizePhone(data.phone),
  createdAt: new Date().toISOString(),
  password: data.password,
  avatar: data.avatar,
  bio: data.bio,
});

const buildProfileFromPending = (pending: PendingAuth): UserProfile => {
  const name = pending.email
    ? pending.email.split("@")[0].replace(/[._\d]/g, " ").trim() || "Guest"
    : pending.phone
    ? `Guest ${pending.phone.slice(-4)}`
    : "Guest";

  return createUserProfile({
    fullName: name,
    email: pending.email || "",
    phone: pending.phone || "",
    password: pending.password,
  });
};

const findUserByEmail = (email: string, users: UserProfile[]) => {
  if (!email) return null;
  const normalizedEmail = email.trim().toLowerCase();
  return users.find((user) => user.email.trim().toLowerCase() === normalizedEmail) ?? null;
};

const upsertUser = (profile: UserProfile, users: UserProfile[]) => {
  const normalizedEmail = profile.email.trim().toLowerCase();
  const updatedUsers = users.filter(
    (user) => user.email.trim().toLowerCase() !== normalizedEmail,
  );
  return [...updatedUsers, profile];
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => load(AUTH_USER_KEY, null));
  const [users, setUsers] = useState<UserProfile[]>(() => load(AUTH_USERS_KEY, []));
  const [pendingAuth, setPendingAuth] = useState<PendingAuth | null>(() => load(AUTH_PENDING_KEY, null));

  useEffect(() => {
    save(AUTH_USER_KEY, user);
  }, [user]);

  useEffect(() => {
    save(AUTH_USERS_KEY, users);
  }, [users]);

  useEffect(() => {
    save(AUTH_PENDING_KEY, pendingAuth);
  }, [pendingAuth]);

  const formatEmailJSError = (error: unknown) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown EmailJS error.";
  }
};

const sendVerificationEmail = async (
    email: string,
    code: string,
    mode: AuthMode,
    fullName?: string,
  ) => {
    if (
      EMAILJS_CONFIG.serviceId === "YOUR_SERVICE_ID" ||
      !EMAILJS_CONFIG.serviceId ||
      EMAILJS_CONFIG.authTemplateId === "YOUR_AUTH_TEMPLATE_ID" ||
      !EMAILJS_CONFIG.authTemplateId
    ) {
      return {
        success: false,
        message:
          "EmailJS is not configured. Please update src/config/emailjs.ts with your EmailJS service and auth template IDs.",
      };
    }

    if (EMAILJS_CONFIG.publicKey) {
      emailjs.init(EMAILJS_CONFIG.publicKey);
    }

    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.authTemplateId,
        {
          to_email: email,
          to_name: fullName || email.split("@")[0],
          code,
          subject:
            mode === "signup"
              ? "Your signup verification code"
              : mode === "reset"
              ? "Your password reset code"
              : "Your verification code",
          message: `Your ${mode === "signup" ? "signup" : mode === "reset" ? "password reset" : "login"} code is ${code}. It expires in 10 minutes.`,
        },
        { publicKey: EMAILJS_CONFIG.publicKey },
      );
      return { success: true, message: "Verification email sent." };
    } catch (err) {
      const detail = formatEmailJSError(err);
      console.error("EmailJS send failed:", err);
      return {
        success: false,
        message: `Unable to send verification email. ${detail}`,
      };
    }
  };

  const createAccount = (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    avatar?: string;
    bio?: string;
  }) => {
    const fullName = data.fullName.trim();
    const email = data.email.trim();
    const phone = data.phone.trim();
    const password = data.password.trim();

    if (!fullName || !email || !phone || !password) {
      return { success: false, message: "Please complete all signup fields." };
    }

    if (findUserByEmail(email, users)) {
      return { success: false, message: "An account with that email already exists." };
    }

    const account = createUserProfile({
      fullName,
      email,
      phone,
      password,
      avatar: data.avatar,
      bio: data.bio,
    });

    setUsers((current) => upsertUser(account, current));
    setUser(account);
    toast({ title: "Account created", description: "You are now logged in." });

    return { success: true, message: "Account created successfully." };
  };

  const loginWithPassword = (email: string, password: string) => {
    const normalizedEmail = email.trim();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      return { success: false, message: "Please enter your email and password." };
    }

    const account = findUserByEmail(normalizedEmail, users);
    if (!account) {
      return { success: false, message: "No account found with that email. Please sign up first." };
    }

    if (!account.password) {
      return { success: false, message: "This account does not have a password set. Please reset your password." };
    }

    if (account.password !== normalizedPassword) {
      return { success: false, message: "Invalid password. Please try again." };
    }

    setUser(account);
    toast({ title: "Signed in", description: "Welcome back!" });
    return { success: true, message: "Logged in successfully." };
  };

  const requestPasswordReset = async (email: string) => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      return { success: false, message: "Please enter your email address." };
    }

    const account = findUserByEmail(normalizedEmail, users);
    if (!account) {
      return { success: false, message: "No account found with that email." };
    }

    const code = generateCode();
    const expiry = Date.now() + 10 * 60 * 1000;
    const emailResult = await sendVerificationEmail(normalizedEmail, code, "reset", account.fullName);
    if (!emailResult.success) {
      return emailResult;
    }

    setPendingAuth({
      email: normalizedEmail,
      method: "email",
      mode: "reset",
      code,
      expiresAt: expiry,
    });

    toast({
      title: "Reset code sent",
      description: `A password reset code was sent to ${normalizedEmail}.`,
    });

    return {
      success: true,
      message: `A 6-digit reset code was sent to ${normalizedEmail}. It expires in 10 minutes.`,
    };
  };

  const resetPassword = (code: string, newPassword: string) => {
    if (!pendingAuth) {
      return { success: false, message: "No password reset session is active. Please request a new code." };
    }

    if (pendingAuth.mode !== "reset") {
      return { success: false, message: "This verification code cannot be used for password reset." };
    }

    if (Date.now() > pendingAuth.expiresAt) {
      setPendingAuth(null);
      return { success: false, message: "Your reset code expired. Request a new one." };
    }

    if (pendingAuth.code !== code.trim()) {
      return { success: false, message: "That reset code does not match. Please try again." };
    }

    if (!newPassword.trim()) {
      return { success: false, message: "Please enter a new password." };
    }

    const account = findUserByEmail(pendingAuth.email ?? "", users);
    if (!account) {
      setPendingAuth(null);
      return { success: false, message: "Unable to find account for password reset." };
    }

    const updated = { ...account, password: newPassword.trim() };
    setUser(updated);
    setUsers((current) => upsertUser(updated, current));
    setPendingAuth(null);
    toast({ title: "Password reset", description: "You can now log in with your new password." });

    return { success: true, message: "Password has been reset successfully." };
  };

  const updateProfile = (profile: { fullName: string; email: string; phone: string; avatar?: string; bio?: string }) => {
    if (!user) return;
    const updated = {
      ...user,
      fullName: profile.fullName.trim() || user.fullName,
      email: profile.email.trim() || user.email,
      phone: normalizePhone(profile.phone) || user.phone,
      avatar: profile.avatar ?? user.avatar,
      bio: profile.bio ?? user.bio,
    };
    setUser(updated);
    setUsers((current) => upsertUser(updated, current));
    toast({ title: "Profile saved", description: "Your account profile has been updated." });
  };

  const logout = () => {
    setUser(null);
    setPendingAuth(null);
    toast({ title: "Signed out", description: "You have been logged out." });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        pendingAuth,
        createAccount,
        loginWithPassword,
        requestPasswordReset,
        resetPassword,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
