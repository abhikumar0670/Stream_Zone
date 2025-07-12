import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../store/slices/commentSlice';
import { toast } from 'react-toastify';

const CommentForm = ({ videoId, parentCommentId = null, replyingTo = null, onCancel }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await dispatch(addComment({
        content: content.trim(),
        videoId,
        parentCommentId
      })).unwrap();
      
      setContent('');
      if (onCancel) {
        onCancel();
      }
      toast.success(parentCommentId ? 'Reply added successfully' : 'Comment added successfully');
    } catch (error) {
      toast.error(error || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    if (onCancel) {
      onCancel();
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#606060',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        Please <a href="/login" style={{ color: '#065fd4', textDecoration: 'none' }}>login</a> to comment
      </div>
    );
  }

  return (
    <div className="comment-form" style={{
      marginBottom: '20px',
      padding: '16px',
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      {replyingTo && (
        <div style={{
          marginBottom: '8px',
          fontSize: '12px',
          color: '#606060'
        }}>
          Replying to <strong>{replyingTo || 'Unknown User'}</strong>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div className="comment-avatar" style={{ flexShrink: 0 }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#e5e5e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#666'
              }}
            >
              {(user?.username || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div style={{ flex: 1 }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={replyingTo ? `Reply to ${replyingTo}...` : "Add a comment..."}
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                resize: 'vertical',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
              disabled={isSubmitting}
            />
            
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              marginTop: '8px'
            }}>
              {replyingTo && (
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #ccc',
                    borderRadius: '18px',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}
              
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '18px',
                  background: content.trim() ? '#065fd4' : '#ccc',
                  color: 'white',
                  cursor: content.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {isSubmitting ? 'Posting...' : (parentCommentId ? 'Reply' : 'Comment')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentForm; 