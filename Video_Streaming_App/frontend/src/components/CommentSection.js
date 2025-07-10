import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getComments } from '../store/slices/commentSlice';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { FaSort, FaFilter } from 'react-icons/fa';

const CommentSection = ({ videoId }) => {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.comment);
  const [sortBy, setSortBy] = useState('newest');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [parentCommentId, setParentCommentId] = useState(null);

  useEffect(() => {
    if (videoId) {
      dispatch(getComments(videoId));
    }
  }, [dispatch, videoId]);



  const handleReply = (commentId, username) => {
    if (!commentId) return;
    setShowReplyForm(true);
    setReplyingTo(username);
    setParentCommentId(commentId);
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
    setReplyingTo(null);
    setParentCommentId(null);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const sortedComments = [...(comments || [])].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'mostLiked':
        return (b.stats?.likesCount || 0) - (a.stats?.likesCount || 0);
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const topLevelComments = sortedComments.filter(comment => !comment.parentComment);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        Loading comments...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#e74c3c' }}>
        Error loading comments: {error}
      </div>
    );
  }

  return (
    <div className="comment-section" style={{
      marginTop: '40px',
      borderTop: '1px solid #e5e5e5',
      paddingTop: '20px'
    }}>
      <div className="comment-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
          {(comments || []).length} Comment{(comments || []).length !== 1 ? 's' : ''}
        </h3>
        
        <div className="comment-controls" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaSort size={14} />
            <select
              value={sortBy}
              onChange={handleSortChange}
              style={{
                padding: '4px 8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="mostLiked">Most liked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <CommentForm 
        videoId={videoId} 
        onCancel={handleCancelReply}
      />

      {/* Reply Form */}
      {showReplyForm && (
        <div style={{ marginBottom: '20px' }}>
          <CommentForm
            videoId={videoId}
            parentCommentId={parentCommentId}
            replyingTo={replyingTo}
            onCancel={handleCancelReply}
          />
        </div>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {topLevelComments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#606060',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <p style={{ margin: 0, fontSize: '16px' }}>
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          topLevelComments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={handleReply}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection; 