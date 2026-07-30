"use client";

import { useState } from "react";
import "./newsletter.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("✅ تم اشتراكك بنجاح! ستصلك آخر الأخبار التقنية.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "حدث خطأ. حاول مرة أخرى.");
      }
    } catch {
      setStatus("error");
      setMessage("تعذر الاتصال بالخادم.");
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-content">
        <div className="newsletter-icon">📬</div>
        <h2>اشترك في نشرتنا البريدية</h2>
        <p>احصل على أحدث الأخبار التقنية مباشرة في بريدك الإلكتروني. لا إزعاج، فقط أهم الأخبار.</p>

        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="بريدك الإلكتروني"
            className="newsletter-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="newsletter-submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? "جاري..." : "اشترك الآن"}
          </button>
        </form>

        {message && (
          <div className={`newsletter-message ${status}`}>
            {message}
          </div>
        )}

        <p className="newsletter-note">🔒 لن نشارك بريدك مع أي جهة خارجية.</p>
      </div>
    </section>
  );
}
