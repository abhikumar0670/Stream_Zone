import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeComment, dislikeComment, deleteComment, editComment } from '../store/slices/commentSlice';
import moment from 'moment';
import { toast } from 'react-toastify';

const Comment = ({ comment, onReply }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  // Add safety checks for comment data
  if (!comment || !comment.author) {
    return null;
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like comments');
      return;
    }
    
    try {
      await dispatch(likeComment(comment.id)).unwrap();
      toast.success(comment.isLiked ? 'Like removed' : 'Comment liked');
    } catch (error) {
      toast.error('Failed to like comment');
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to dislike comments');
      return;
    }
    
    try {
      await dispatch(dislikeComment(comment.id)).unwrap();
      toast.success(comment.isDisliked ? 'Dislike removed' : 'Comment disliked');
    } catch (error) {
      toast.error('Failed to dislike comment');
    }
  };

  const handleReply = () => {
    if (!isAuthenticated) {
      toast.error('Please login to reply to comments');
      return;
    }
    onReply(comment.id, comment.author.username);
  };

  const handleDelete = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to delete comments');
      return;
    }

    if (comment.author.id !== user?.id && user?.role !== 'admin') {
      toast.error('You can only delete your own comments');
      return;
    }

    try {
      await dispatch(deleteComment(comment.id)).unwrap();
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleEdit = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to edit comments');
      return;
    }

    if (comment.author.id !== user?.id) {
      toast.error('You can only edit your own comments');
      return;
    }

    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await dispatch(editComment({ commentId: comment.id, content: editContent.trim() })).unwrap();
      setIsEditing(false);
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  return (
    <div className="comment">
      <div className="comment-avatar">
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
          {(comment.author.username || 'U').charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="comment-body">
        <div className="comment-header">
          <span className="comment-author">
            {comment.author.username || 'Unknown User'}
          </span>
          <span className="comment-date">
            {moment(comment.createdAt).fromNow()}
          </span>
          {comment.isEdited && (
            <span style={{
              color: '#606060',
              fontSize: '12px',
              marginLeft: '8px'
            }}>
              (edited)
            </span>
          )}
        </div>
        <div className="comment-content">
          {isEditing ? (
            <div style={{ marginBottom: '8px' }}>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '60px',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                placeholder="Edit your comment..."
              />
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '8px'
              }}>
                <button
                  onClick={handleEdit}
                  style={{
                    padding: '4px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    background: '#065fd4',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    padding: '4px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    background: '#eee',
                    color: '#333',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            comment.content
          )}
        </div>
        {/* Comment actions/footer here if needed */}
      </div>
    </div>
  );
};

export default Comment; 