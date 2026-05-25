import { useState } from "react";
import emailjs from "@emailjs/browser";
import { MessageCircle, Instagram, Mail, Phone } from "lucide-react";
import "@/styles/Contact.css";

// EmailJS config — replace with your real IDs in src/config/emailjs.ts
import { EMAILJS_CONFIG } from "@/config/emailjs";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setStatus("sending");
    try {
      if (
        EMAILJS_CONFIG.serviceId === "YOUR_SERVICE_ID" ||
        !EMAILJS_CONFIG.serviceId
      ) {
        // EmailJS not yet configured — fallback to mailto so the form still works.
        window.location.href = `mailto:hello@ammclothing.store?subject=${encodeURIComponent(
          "Inquiry from " + name,
        )}&body=${encodeURIComponent(message + "\n\nFrom: " + email)}`;
        setStatus("sent");
        return;
      }
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.contactTemplateId,
        { from_name: name, reply_to: email, message },
        { publicKey: EMAILJS_CONFIG.publicKey },
      );
      setStatus("sent");
      setName(""); setEmail(""); setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">
        <div>
          <h2>Get in touch</h2>
          <p>
            Questions about sizing, delivery or styling? Reach out — we usually reply within
            an hour during business hours.
          </p>
          <div className="contact-links">
            <a
              className="contact-link"
              href="https://wa.me/254791473580"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={20} /> WhatsApp · 
            </a>
            <a className="contact-link" href="tel:+254791473580">
              <Phone size={20} /> Call · 
            </a>
            <a
              className="contact-link"
              href="https://instagram.com/maynairr"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={20} /> @maynairr
            </a>
            <a className="contact-link" href="mailto:atekasworld@gmail.com">
              <Mail size={20} /> atekasworld@gmail.com
            </a>
          </div>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            required
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={120}
            required
          />
          <textarea
            placeholder="How can we help?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
            required
          />
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." :
              status === "sent" ? "Sent ✓" :
              status === "error" ? "Try again" : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
