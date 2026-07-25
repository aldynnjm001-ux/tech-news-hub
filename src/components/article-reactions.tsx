"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, Zap, AlertTriangle } from "lucide-react";

export default function ArticleReactions({ articleId, initialUseful, initialMindblown, initialDanger }: { articleId: string, initialUseful: number, initialMindblown: number, initialDanger: number }) {
  const [useful, setUseful] = useState(initialUseful);
  const [mindblown, setMindblown] = useState(initialMindblown);
  const [danger, setDanger] = useState(initialDanger);
  const [reacted, setReacted] = useState<string | null>(null);

  useEffect(() => {
    // Check if user already reacted to this article
    const storedReaction = localStorage.getItem(`reaction_${articleId}`);
    if (storedReaction) {
      setReacted(storedReaction);
    }
  }, [articleId]);

  const handleReaction = async (type: 'useful' | 'mindblown' | 'danger') => {
    if (reacted) return; // Prevent multiple reactions

    // Optimistic update
    if (type === 'useful') setUseful(prev => prev + 1);
    if (type === 'mindblown') setMindblown(prev => prev + 1);
    if (type === 'danger') setDanger(prev => prev + 1);
    
    setReacted(type);
    localStorage.setItem(`reaction_${articleId}`, type);

    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: articleId, type }),
      });
    } catch (error) {
      console.error("Failed to post reaction:", error);
    }
  };

  return (
    <div className="article-reactions glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>ما رأيك في هذا الخبر؟</h3>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          onClick={() => handleReaction('useful')}
          disabled={reacted !== null}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem',
            border: reacted === 'useful' ? '2px solid #22c55e' : '1px solid var(--border)',
            background: reacted === 'useful' ? 'rgba(34, 197, 94, 0.1)' : 'var(--background)',
            color: reacted === 'useful' ? '#22c55e' : 'var(--foreground)',
            borderRadius: '30px', cursor: reacted ? 'default' : 'pointer',
            transition: 'all 0.2s', fontWeight: 600
          }}
        >
          <ThumbsUp size={18} />
          مفيد
          <span style={{ background: 'var(--card)', padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.8rem', marginLeft: '0.25rem' }}>{useful}</span>
        </button>

        <button 
          onClick={() => handleReaction('mindblown')}
          disabled={reacted !== null}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem',
            border: reacted === 'mindblown' ? '2px solid #a855f7' : '1px solid var(--border)',
            background: reacted === 'mindblown' ? 'rgba(168, 85, 247, 0.1)' : 'var(--background)',
            color: reacted === 'mindblown' ? '#a855f7' : 'var(--foreground)',
            borderRadius: '30px', cursor: reacted ? 'default' : 'pointer',
            transition: 'all 0.2s', fontWeight: 600
          }}
        >
          <Zap size={18} />
          مذهل
          <span style={{ background: 'var(--card)', padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.8rem', marginLeft: '0.25rem' }}>{mindblown}</span>
        </button>

        <button 
          onClick={() => handleReaction('danger')}
          disabled={reacted !== null}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem',
            border: reacted === 'danger' ? '2px solid #ef4444' : '1px solid var(--border)',
            background: reacted === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'var(--background)',
            color: reacted === 'danger' ? '#ef4444' : 'var(--foreground)',
            borderRadius: '30px', cursor: reacted ? 'default' : 'pointer',
            transition: 'all 0.2s', fontWeight: 600
          }}
        >
          <AlertTriangle size={18} />
          خطير
          <span style={{ background: 'var(--card)', padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.8rem', marginLeft: '0.25rem' }}>{danger}</span>
        </button>
      </div>
    </div>
  );
}
