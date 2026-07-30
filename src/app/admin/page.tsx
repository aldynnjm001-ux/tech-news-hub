"use client";

import { useState, useEffect } from "react";
import "./admin.css";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("admin_password");
    if (saved) {
      setPassword(saved);
      fetchData(saved);
    }
  }, []);

  const fetchData = async (pass: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", {
        headers: {
          "Authorization": `Bearer ${pass}`
        }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setIsAuthenticated(true);
        localStorage.setItem("admin_password", pass);
      } else {
        setError("كلمة المرور غير صحيحة أو غير مصرح لك.");
        setIsAuthenticated(false);
        localStorage.removeItem("admin_password");
      }
    } catch (e) {
      setError("حدث خطأ في الاتصال.");
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(password);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_password");
    setIsAuthenticated(false);
    setData(null);
    setPassword("");
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;
    try {
      const res = await fetch(`/api/admin?articleId=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${password}` }
      });
      if (res.ok) fetchData(password);
    } catch (e) {
      alert("خطأ أثناء الحذف");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    try {
      const res = await fetch(`/api/admin?messageId=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${password}` }
      });
      if (res.ok) fetchData(password);
    } catch (e) {
      alert("خطأ أثناء الحذف");
    }
  };

  const markMessageRead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin`, {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${password}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messageId: id })
      });
      if (res.ok) fetchData(password);
    } catch (e) {
      alert("خطأ أثناء التحديث");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <form className="login-form glass" onSubmit={handleLogin}>
          <h2>تسجيل الدخول للإدارة</h2>
          {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
          <input 
            type="password" 
            placeholder="كلمة المرور" 
            className="login-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "جاري التحقق..." : "دخول"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">لوحة التحكم</h1>
        <button onClick={handleLogout} className="logout-btn">تسجيل الخروج</button>
      </div>

      {data && (
        <>
          <div className="stats-grid">
            <div className="stat-card glass">
              <h3>المقالات</h3>
              <p className="stat-value">{data.stats.articles}</p>
            </div>
            <div className="stat-card glass">
              <h3>التعليقات</h3>
              <p className="stat-value">{data.stats.comments}</p>
            </div>
            <div className="stat-card glass">
              <h3>المشتركين</h3>
              <p className="stat-value">{data.stats.subscribers}</p>
            </div>
            <div className="stat-card glass">
              <h3>الرسائل غير المقروءة</h3>
              <p className="stat-value" style={{ color: data.stats.unreadMessages > 0 ? '#ef4444' : 'inherit' }}>
                {data.stats.unreadMessages}
              </p>
            </div>
          </div>

          <div className="admin-section">
            <h2>الرسائل الأخيرة (اتصل بنا)</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table glass">
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>البريد</th>
                    <th>الموضوع</th>
                    <th>التاريخ</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {data.messages.map((m: any) => (
                    <tr key={m.id} className={!m.isRead ? 'unread-row' : ''}>
                      <td>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.subject}</td>
                      <td>{new Date(m.createdAt).toLocaleDateString('ar-EG')}</td>
                      <td>
                        {!m.isRead && (
                          <button className="action-btn read" onClick={() => markMessageRead(m.id)}>تحديد كمقروءة</button>
                        )}
                        <button className="action-btn delete" onClick={() => deleteMessage(m.id)}>حذف</button>
                      </td>
                    </tr>
                  ))}
                  {data.messages.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center' }}>لا توجد رسائل</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-section">
            <h2>أحدث المقالات المضافة</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table glass">
                <thead>
                  <tr>
                    <th>العنوان</th>
                    <th>القسم</th>
                    <th>المصدر</th>
                    <th>القراءات</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentArticles.map((a: any) => (
                    <tr key={a.id}>
                      <td><a href={`/article/${a.id}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>{a.title.substring(0, 50)}...</a></td>
                      <td>{a.category}</td>
                      <td>{a.sourceName}</td>
                      <td>{a.viewCount}</td>
                      <td>
                        <button className="action-btn delete" onClick={() => deleteArticle(a.id)}>حذف المقال</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
