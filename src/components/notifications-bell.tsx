"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, X } from "lucide-react";

export default function NotificationsBell() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
      // Show the banner after 3 seconds if the user hasn't decided yet
      if (Notification.permission === "default") {
        const timer = setTimeout(() => setShowBanner(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;

    const result = await Notification.requestPermission();
    setPermission(result);
    setShowBanner(false);

    if (result === "granted") {
      // Send a welcome notification immediately
      new Notification("🔔 مرحباً بك في أخبار التكنولوجيا!", {
        body: "سيتم إشعارك بأهم الأخبار التقنية فور نزولها!",
        icon: "/favicon.ico",
      });
    }
  };

  const revokeNotifications = () => {
    setPermission("denied");
    setShowBanner(false);
  };

  const isGranted = permission === "granted";

  return (
    <>
      {/* Bell icon in Navbar - shown as active/inactive */}
      <button
        className="icon-btn"
        aria-label="Notifications"
        title={isGranted ? "الإشعارات مفعّلة" : "تفعيل الإشعارات"}
        onClick={() => {
          if (!isGranted) {
            requestPermission();
          } else {
            setShowBanner(false);
          }
        }}
        style={{ position: "relative" }}
      >
        {isGranted ? (
          <Bell size={20} style={{ color: "var(--primary)" }} />
        ) : (
          <BellOff size={20} />
        )}
        {isGranted && (
          <span
            style={{
              position: "absolute",
              top: "2px",
              left: "2px",
              width: "8px",
              height: "8px",
              background: "#22c55e",
              borderRadius: "50%",
              border: "2px solid var(--background)",
            }}
          />
        )}
      </button>

      {/* Permission Banner - shown after 3s if permission is "default" */}
      {showBanner && permission === "default" && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            left: "2rem",
            maxWidth: "420px",
            margin: "0 auto",
            zIndex: 9999,
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            animation: "slideUp 0.4s ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <span style={{ fontSize: "2rem" }}>🔔</span>
              <div>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>
                  لا تفوت أي خبر تقني!
                </h3>
                <p style={{ margin: "0.25rem 0 0", color: "var(--muted)", fontSize: "0.875rem" }}>
                  فعّل الإشعارات لتصلك أهم الأخبار فور نزولها.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: "0.25rem" }}
            >
              <X size={16} />
            </button>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={requestPermission}
              style={{
                flex: 1,
                background: "var(--primary)",
                color: "white",
                border: "none",
                padding: "0.75rem",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.9rem",
              }}
            >
              تفعيل الإشعارات
            </button>
            <button
              onClick={revokeNotifications}
              style={{
                flex: 1,
                background: "transparent",
                color: "var(--muted)",
                border: "1px solid var(--border)",
                padding: "0.75rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.9rem",
              }}
            >
              ليس الآن
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
