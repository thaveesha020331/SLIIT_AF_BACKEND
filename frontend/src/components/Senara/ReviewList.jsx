import React from 'react';
import ReviewCard from './ReviewCard';

const ReviewList = ({ reviews = [] }) => {
  if (!reviews.length) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-5 text-center text-sm text-gray-500">
        No reviews yet. Be the first to share your eco-friendly experience.
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id || review._id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;

