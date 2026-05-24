import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check, Loader2, ArrowLeft, CreditCard, Smartphone, MapPin, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { supabase } from "@/integrations/supabase/client";
import DeliveryMap from "./DeliveryMap";
import "@/styles/Cart.css";
import "@/styles/Checkout.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Timing = "now" | "delivery";
type PayMethod = "mpesa" | "card";
type Step = "timing" | "details" | "map" | "method" | "mpesa" | "card" | "waiting" | "success" | "failed";

const WHATSAPP_NUMBER = "254791473580";
const WAIT_SECONDS = 60;

const Checkout = ({ open, onClose }: Props) => {
  const { cart, cartTotal, clearCart } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("timing");
  const [timing, setTiming] = useState<Timing>("now");
  const [method, setMethod] = useState<PayMethod>("mpesa");

  const [name, setName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState("");
  const [pos, setPos] = useState<[number, number]>([-1.2921, 36.8219]);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // card fields (UI only)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitLeft, setWaitLeft] = useState(WAIT_SECONDS);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setStep("timing");
      setError(null);
      setLoading(false);
      setWaitLeft(WAIT_SECONDS);
    }
  }, [open]);

  // Waiting countdown
  useEffect(() => {
    if (step !== "waiting") return;
    setWaitLeft(WAIT_SECONDS);
    const id = setInterval(() => {
      setWaitLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setStep("failed");
          setError("Payment confirmation timed out. Please try again.");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  if (!open) return null;

  if (!user) {
    return (
      <>
        <div className="drawer-backdrop" onClick={onClose} />
        <aside className="drawer" role="dialog" aria-label="Checkout">
          <div className="drawer-header">
            <h2 className="drawer-title">Login required</h2>
            <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
          </div>
          <div className="checkout-form">
            <p className="ck-lead">
              You need an account to complete your order. Please log in or sign up first.
            </p>
            <button className="btn" onClick={() => navigate("/login")}>Login now</button>
          </div>
        </aside>
      </>
    );
  }

  const sendWhatsApp = (paymentLabel: string) => {
    const lines = cart.map((i) => `• ${i.name} × ${i.quantity} — Ksh ${(i.price * i.quantity).toLocaleString()}`).join("%0A");
    const mapLink = `https://www.google.com/maps?q=${pos[0]},${pos[1]}`;
    const message =
      `*New Order — Ricky·PMM*%0A%0A` +
      `*Name:* ${encodeURIComponent(name)}%0A` +
      `*Phone:* ${encodeURIComponent(phone)}%0A` +
      `*Address:* ${encodeURIComponent(address)}%0A` +
      `*Location:* ${mapLink}%0A` +
      `*Payment:* ${encodeURIComponent(paymentLabel)}%0A%0A` +
      `*Items:*%0A${lines}%0A%0A` +
      `*Total:* Ksh ${cartTotal.toLocaleString()}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const locateCurrentPosition = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPos([position.coords.latitude, position.coords.longitude]);
        setIsLocating(false);
      },
      (geoErr) => {
        setIsLocating(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setGeoError("Location permission denied. Please allow location access to use this feature.");
        } else {
          setGeoError("Unable to determine your location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const triggerStkPush = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("mpesa-stk-push", {
        body: { phone, amount: cartTotal, reference: `Order for ${name}` },
      });
      if (fnErr) throw fnErr;
      if (!data?.success) throw new Error(data?.error ?? "Payment request failed");
      setStep("waiting");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not send M-Pesa prompt.";
      setError(`${msg} Please check the phone number and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const finishSuccess = (label: string) => {
    sendWhatsApp(label);
    clearCart();
    setStep("success");
  };

  const back = (to: Step) => { setError(null); setStep(to); };

  const Header = ({ title, onBack }: { title: string; onBack?: () => void }) => (
    <div className="drawer-header">
      <div className="ck-head-left">
        {onBack && (
          <button className="icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        )}
        <h2 className="drawer-title">{title}</h2>
      </div>
      <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
    </div>
  );

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Checkout">
        {step === "timing" && (
          <>
            <Header title="Checkout" />
            <div className="checkout-form">
              <p className="ck-lead">When would you like to pay?</p>
              <div className="ck-choice-grid">
                <button
                  className={`ck-choice ${timing === "now" ? "selected" : ""}`}
                  onClick={() => setTiming("now")}
                >
                  <strong>Pay now</strong>
                  <span>M-Pesa or card payment</span>
                </button>
                <button
                  className={`ck-choice ${timing === "delivery" ? "selected" : ""}`}
                  onClick={() => setTiming("delivery")}
                >
                  <strong>Pay on delivery</strong>
                  <span>Settle when your order arrives</span>
                </button>
              </div>
              <div className="checkout-summary">
                <span>Total</span>
                <span>Ksh {cartTotal.toLocaleString()}</span>
              </div>
              <button className="btn" onClick={() => setStep("details")} disabled={cart.length === 0}>
                Continue
              </button>
            </div>
          </>
        )}

        {step === "details" && (
          <>
            <Header title="Your details" onBack={() => back("timing")} />
            <form
              className="checkout-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!name || !phone || !address) return;
                setStep("map");
              }}
            >
              <div className="field">
                <label>Full name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
              </div>
              <div className="field">
                <label>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XX XXX XXX"
                  required
                  maxLength={20}
                />
              </div>
              <div className="field">
                <label>Delivery address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} required maxLength={120} />
              </div>
              <button className="btn" type="submit">Continue to map</button>
            </form>
          </>
        )}

        {step === "map" && (
          <>
            <Header title="Drop-off location" onBack={() => back("details")} />
            <div className="checkout-form">
              <p className="ck-lead"><MapPin size={16} /> Tap the map to pin your delivery spot.</p>
              <div className="field">
                <DeliveryMap position={pos} onChange={setPos} />
                <span className="map-hint">Pinned: {pos[0].toFixed(4)}, {pos[1].toFixed(4)}</span>
              </div>
              <div className="map-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={locateCurrentPosition}
                  disabled={isLocating}
                >
                  {isLocating ? "Finding location…" : "Use my current location"}
                </button>
                {geoError && <div className="checkout-error">{geoError}</div>}
              </div>
              <button
                className="btn"
                onClick={() => {
                  if (timing === "now") setStep("method");
                  else finishSuccess("Pay on delivery");
                }}
              >
                {timing === "now" ? "Continue to payment" : "Place order"}
              </button>
            </div>
          </>
        )}

        {step === "method" && (
          <>
            <Header title="Payment method" onBack={() => back("map")} />
            <div className="checkout-form">
              <div className="ck-choice-grid">
                <button
                  className={`ck-choice ${method === "mpesa" ? "selected" : ""}`}
                  onClick={() => setMethod("mpesa")}
                >
                  <Smartphone size={22} />
                  <strong>M-Pesa</strong>
                  <span>STK push to your phone</span>
                </button>
                <button
                  className={`ck-choice ${method === "card" ? "selected" : ""}`}
                  onClick={() => setMethod("card")}
                >
                  <CreditCard size={22} />
                  <strong>Card</strong>
                  <span>Visa / Mastercard</span>
                </button>
              </div>
              <button className="btn" onClick={() => setStep(method === "mpesa" ? "mpesa" : "card")}>
                Continue
              </button>
            </div>
          </>
        )}

        {step === "mpesa" && (
          <>
            <Header title="Pay with M-Pesa" onBack={() => back("method")} />
            <form
              className="checkout-form"
              onSubmit={(e) => { e.preventDefault(); triggerStkPush(); }}
            >
              <div className="field">
                <label>M-Pesa phone number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XX XXX XXX"
                  required
                  maxLength={20}
                />
                <span className="map-hint">We'll send an STK prompt to this number.</span>
              </div>
              <div className="checkout-summary">
                <span>Amount</span>
                <span>Ksh {cartTotal.toLocaleString()}</span>
              </div>
              {error && <div className="checkout-error"><AlertCircle size={14} /> {error}</div>}
              <button className="btn" type="submit" disabled={loading}>
                {loading ? (<><Loader2 size={16} className="spin" /> Sending STK push…</>) : "Send M-Pesa prompt"}
              </button>
            </form>
          </>
        )}

        {step === "card" && (
          <>
            <Header title="Pay with card" onBack={() => back("method")} />
            <form
              className="checkout-form"
              onSubmit={(e) => {
                e.preventDefault();
                // Card processing is a UI placeholder — finalize order via WhatsApp.
                finishSuccess("Card payment");
              }}
            >
              <div className="field">
                <label>Card number</label>
                <input
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength={19}
                />
              </div>
              <div className="ck-card-row">
                <div className="field">
                  <label>Expiry</label>
                  <input value={cardExp} onChange={(e) => setCardExp(e.target.value)} placeholder="MM/YY" required maxLength={5} />
                </div>
                <div className="field">
                  <label>CVV</label>
                  <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="123" required maxLength={4} />
                </div>
              </div>
              <div className="checkout-summary">
                <span>Amount</span>
                <span>Ksh {cartTotal.toLocaleString()}</span>
              </div>
              <button className="btn" type="submit">Pay Ksh {cartTotal.toLocaleString()}</button>
            </form>
          </>
        )}

        {step === "waiting" && (
          <>
            <Header title="Awaiting confirmation" />
            <div className="success-state">
              <Loader2 size={48} className="spin" color="var(--gold)" />
              <h3>Check your phone</h3>
              <p>
                An M-Pesa prompt has been sent to <strong>{phone}</strong>. Enter your PIN to complete the payment.
              </p>
              <div className="ck-wait-timer">{waitLeft}s</div>
              <div className="ck-wait-actions">
                <button className="btn" onClick={() => finishSuccess("M-Pesa STK Push (Lipana)")}>
                  I have completed payment
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => { setError("Payment was not completed."); setStep("failed"); }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <Header title="Order confirmed" />
            <div className="success-state">
              <Check size={48} color="var(--gold)" />
              <h3>Payment successful</h3>
              <p>Thanks {name || "friend"} — your order is on its way. We've also notified the shop on WhatsApp.</p>
              <button className="btn" style={{ marginTop: 20 }} onClick={onClose}>Continue shopping</button>
            </div>
          </>
        )}

        {step === "failed" && (
          <>
            <Header title="Payment failed" />
            <div className="success-state">
              <AlertCircle size={48} color="#d33" />
              <h3>Payment failed</h3>
              <p>{error ?? "We couldn't confirm your payment."}</p>
              <div className="ck-wait-actions">
                <button className="btn" onClick={() => back("mpesa")}>Try again</button>
                <button className="btn btn-ghost" onClick={onClose}>Close</button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default Checkout;
