"use client";

import { useState, useEffect } from "react";
import { categories } from "@/lib/data";
import { X, SlidersHorizontal, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PersonalizationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Read initial preferences from cookies
    const match = document.cookie.match(new RegExp('(^| )preferredCategories=([^;]+)'));
    if (match) {
      try {
        setSelected(JSON.parse(decodeURIComponent(match[2])));
      } catch (e) {
        setSelected([]);
      }
    }
  }, [isOpen]);

  const toggleCategory = (cat: string) => {
    setSelected(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const savePreferences = () => {
    if (selected.length > 0) {
      document.cookie = `preferredCategories=${encodeURIComponent(JSON.stringify(selected))}; path=/; max-age=31536000`; // 1 year
    } else {
      document.cookie = `preferredCategories=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`; // Delete cookie
    }
    
    setIsOpen(false);
    // Refresh the page to apply server-side filtering
    router.refresh();
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="icon-btn" 
        style={{ width: '100%', display: 'flex', gap: '0.5rem', justifyContent: 'center', background: 'var(--primary)', color: 'white', borderRadius: '8px', padding: '0.75rem', marginTop: '1rem', fontWeight: 600 }}
      >
        <SlidersHorizontal size={18} />
        تخصيص اهتماماتي
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="glass" style={{
            background: 'var(--card)', width: '90%', maxWidth: '450px',
            borderRadius: 'var(--radius)', padding: '2rem', position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>ما هي اهتماماتك؟</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>اختر المجالات التي تهمك لتظهر لك كأولوية في الصفحة الرئيسية.</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
              {Object.entries(categories).map(([key, label]) => {
                const isSelected = selected.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleCategory(key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600,
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: isSelected ? 'rgba(37, 99, 235, 0.1)' : 'var(--background)',
                      color: isSelected ? 'var(--primary)' : 'var(--foreground)',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {isSelected && <Check size={14} />}
                    {label}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={savePreferences}
              style={{ width: '100%', padding: '0.875rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
            >
              حفظ التفضيلات
            </button>
          </div>
        </div>
      )}
    </>
  );
}
