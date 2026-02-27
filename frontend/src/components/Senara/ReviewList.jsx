import React from 'react';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

const ReviewList = ({
  reviews = [],
  currentUserId,
  editingId,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  submitting = false,
}) => {
  if (!reviews.length) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-5 text-center text-sm text-gray-500">
        No reviews yet. Be the first to share your eco-friendly experience.
      </div>
    );
  }

  const normalizeId = (id) => {
    if (id == null) return '';
    if (typeof id === 'string') return id;
    if (typeof id === 'object' && id.toString) return id.toString();
    return String(id);
  };

  const currentUserStr = currentUserId ? normalizeId(currentUserId) : '';

  return (
    <div className="mt-4 flex flex-col gap-3">
      {reviews.map((review) => {
        const reviewId = review.id ?? review._id;
        const reviewIdStr = normalizeId(reviewId);
        const isOwn = Boolean(
          currentUserStr &&
          review.userId != null &&
          normalizeId(review.userId) === currentUserStr
        );
        const isEditing = editingId != null && normalizeId(editingId) === reviewIdStr;

        if (isEditing) {
          return (
            <div key={reviewIdStr || reviewId} className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4">
              <ReviewForm
                initialValues={{
                  rating: Math.min(5, Math.max(1, Number(review.rating) || 1)),
                  title: review.title || '',
                  comment: review.comment || '',
                }}
                onSubmit={(data) => onUpdate && onUpdate(reviewIdStr || reviewId, data)}
                onCancel={onCancelEdit}
                submitting={submitting}
              />
            </div>
          );
        }

        return (
          <ReviewCard
            key={reviewIdStr || reviewId}
            review={review}
            isOwnReview={isOwn}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};

export default ReviewList;