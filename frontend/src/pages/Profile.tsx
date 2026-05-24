import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import "@/styles/Auth.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar ?? "");
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Keep local avatar in sync with the saved context value,
  // but only when there is no pending (unsaved) selection.
  useEffect(() => {
    if (!pendingAvatar && user?.avatar !== undefined) {
      setAvatar(user.avatar ?? "");
      setAvatarPreview(user.avatar ?? "");
    }
  }, [user?.avatar, pendingAvatar]);

  if (!user) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If the user picked a new photo but didn't click "Save photo" yet,
    // commit it together with the rest of the profile so it isn't lost.
    const finalAvatar = pendingAvatar ?? avatar;
    updateProfile({ fullName, email, phone, avatar: finalAvatar, bio });
    if (pendingAvatar) {
      setAvatar(pendingAvatar);
      setPendingAvatar(null);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setPendingAvatar(result);
        setAvatarPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = () => {
    if (!pendingAvatar) return;
    setAvatar(pendingAvatar);
    // Save only the avatar; keep other profile fields as currently stored in context
    updateProfile({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatar: pendingAvatar,
      bio: user.bio,
    });
    setPendingAvatar(null);
  };

  const handleCancelAvatar = () => {
    setAvatarPreview(avatar);
    setPendingAvatar(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-profile-card">
        <div className="auth-hero">
          <div className="profile-avatar-wrap">
            <button type="button" className="profile-avatar-hero" onClick={triggerAvatarUpload}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile avatar" />
              ) : (
                <div className="profile-avatar-hero-placeholder">Tap to add photo</div>
              )}
              <span className="avatar-change-hint">{avatarPreview ? "Tap to change" : ""}</span>
            </button>

            {pendingAvatar && (
              <div className="avatar-save-actions">
                <button type="button" className="btn avatar-btn-save" onClick={handleSaveAvatar}>
                  Save photo
                </button>
                <button type="button" className="btn btn-outline avatar-btn-cancel" onClick={handleCancelAvatar}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div>
            <p className="eyebrow">Your profile</p>
            <h1 className="auth-heading">Manage your account</h1>
            <p className="auth-text">
              Keep your full name, email and phone number up to date for fast checkout and order confirmation.
            </p>
          </div>
          <div className="auth-note">
            NOTE! Your profile is required to add items to the cart and complete orders.
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="auth-panel">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field field-underline">
              <label>Short bio</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio"
                maxLength={160}
              />
            </div>
            <div className="field">
              <label>Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Phone number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn">
              Save profile
            </button>
          </form>

          <div className="auth-footer profile-actions">
            <button type="button" className="btn btn-outline" onClick={() => logout()}>
              Log out
            </button>
            <Link to="/" className="auth-link">
              Back to shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
