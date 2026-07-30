"use client";

import { useState } from "react";
import { Send, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import "./page.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setStatusMessage("✅ تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await res.json();
        setStatus("error");
        setStatusMessage(data.error || "حدث خطأ أثناء إرسال الرسالة.");
      }
    } catch {
      setStatus("error");
      setStatusMessage("تعذر الاتصال بالخادم. حاول مرة أخرى.");
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container animate-fade-in-up">
          <h1><span className="text-gradient">اتصل بنا</span></h1>
          <p>نسعد بتواصلك معنا. أرسل لنا رسالتك وسنرد في أقرب وقت ممكن.</p>
        </div>
      </section>

      <div className="container">
        <div className="contact-grid">
          {/* Form */}
          <div className="contact-form-card glass">
            <h2><MessageSquare size={22} style={{ marginLeft: "0.5rem", verticalAlign: "middle" }} />أرسل رسالتك</h2>
            
            {status !== "idle" && status !== "loading" && (
              <div className={`form-alert ${status}`}>
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact-name">الاسم</label>
                  <input 
                    id="contact-name"
                    type="text" 
                    placeholder="اكتب اسمك الكامل"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">البريد الإلكتروني</label>
                  <input 
                    id="contact-email"
                    type="email" 
                    placeholder="example@email.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">الموضوع</label>
                <select 
                  id="contact-subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="">اختر الموضوع</option>
                  <option value="اقتراح">اقتراح أو فكرة</option>
                  <option value="إبلاغ عن مشكلة">إبلاغ عن مشكلة</option>
                  <option value="إعلان ورعاية">إعلان ورعاية</option>
                  <option value="تعاون">تعاون إعلامي</option>
                  <option value="استفسار عام">استفسار عام</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">الرسالة</label>
                <textarea 
                  id="contact-message"
                  placeholder="اكتب رسالتك هنا..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button 
                type="submit" 
                className="contact-submit-btn"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  "جاري الإرسال..."
                ) : (
                  <>
                    <Send size={18} />
                    إرسال الرسالة
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar Info */}
          <div className="contact-info-sidebar">
            <div className="contact-info-card glass">
              <h3>معلومات التواصل</h3>
              
              <div className="info-item">
                <div className="info-icon"><Mail size={20} /></div>
                <div>
                  <h4>البريد الإلكتروني</h4>
                  <p>info@technewshub.com</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><MapPin size={20} /></div>
                <div>
                  <h4>الموقع</h4>
                  <p>منصة رقمية - الوطن العربي</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><Clock size={20} /></div>
                <div>
                  <h4>أوقات الرد</h4>
                  <p>خلال 24-48 ساعة عمل</p>
                </div>
              </div>
            </div>

            <div className="contact-info-card glass">
              <h3>للإعلان والرعاية</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "1rem" }}>
                نقدم فرصاً إعلانية مميزة للوصول إلى جمهور تقني واعٍ ومتفاعل.
              </p>
              <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
                <strong style={{ color: "var(--foreground)" }}>البريد:</strong> ads@technewshub.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
