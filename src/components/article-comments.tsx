'use client';

import { useState, useEffect } from 'react';
import { User, Clock, Loader2 } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function ArticleComments({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?articleId=${articleId}`);
      const data = await res.json();
      if (data.comments) {
        setComments(data.comments);
      }
    } catch (err) {
      console.error('Failed to fetch comments', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          content: newComment,
          author: author.trim() || 'زائر',
        }),
      });

      if (!res.ok) {
        throw new Error('فشل إرسال التعليق');
      }

      const data = await res.json();
      setComments([data.comment, ...comments]);
      setNewComment('');
      setAuthor('');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الإرسال');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comments-section">
      <h3>التعليقات</h3>
      
      <form onSubmit={handleSubmit} className="comment-form glass" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', borderRadius: '12px' }}>
        <input 
          type="text"
          placeholder="الاسم (اختياري)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="comment-input"
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
        />
        <textarea 
          placeholder="أضف تعليقك هنا..." 
          className="comment-input" 
          rows={4}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', resize: 'vertical' }}
        />
        {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={isSubmitting || !newComment.trim()}
          style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: (isSubmitting || !newComment.trim()) ? 0.7 : 1 }}
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
          {isSubmitting ? 'جاري الإرسال...' : 'إرسال التعليق'}
        </button>
      </form>

      <div className="comments-list" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {isLoading ? (
          <p className="no-comments">جاري تحميل التعليقات...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item glass" style={{ padding: '1rem 1.5rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', color: '#60a5fa' }}>
                  <User size={14} /> {comment.author}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', opacity: 0.6 }}>
                  <Clock size={12} /> {new Date(comment.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="no-comments">كن أول من يعلق على هذا الخبر!</p>
        )}
      </div>
    </div>
  );
}
