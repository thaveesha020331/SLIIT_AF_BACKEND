import React from 'react';
import StarRating from './StarRating';

const ReviewCard = ({ review }) => {
  if (!review) return null;

  const {
    authorName,
    title,
    comment,
    rating,
    createdAt,
    variant,
    ecoTags = [],
  } = review;

  const dateLabel = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : 'Recently';

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-gray-900">
            {authorName || 'Anonymous user'}
          </div>
          <div className="text-xs text-gray-500">{dateLabel}</div>
        </div>
        <StarRating value={Number(rating) || 0} readOnly />
      </div>

      {title && (
        <div className="mt-1 font-semibold text-gray-900">
          {title}
        </div>
      )}

      {comment && (
        <p className="text-sm text-gray-700">{comment}</p>
      )}

      {(variant || ecoTags.length > 0) && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {variant && (
            <span
              className="rounded-full border border-sky-200 bg-sky-50 px-2 py-1 text-sky-800"
            >
              {variant}
            </span>
          )}
          {ecoTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;

