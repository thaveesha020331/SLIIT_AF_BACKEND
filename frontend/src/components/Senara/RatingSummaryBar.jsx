import React, { useMemo } from 'react';
import StarRating from './StarRating';

const RatingSummaryBar = ({ reviews = [] }) => {
  const { average, counts, total } = useMemo(() => {
    if (!reviews.length) {
      return {
        average: 0,
        counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        total: 0,
      };
    }

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    reviews.forEach((r) => {
      const rating = Number(r.rating) || 0;
      if (rating >= 1 && rating <= 5) {
        counts[rating] += 1;
        sum += rating;
      }
    });

    const total = reviews.length;
    const average = total ? sum / total : 0;

    return { average, counts, total };
  }, [reviews]);

  return (
    <div className="grid gap-6 rounded-lg bg-white p-5 shadow-sm md:grid-cols-[1.2fr_2fr]">
      <div className="border-b border-gray-200 pb-4 text-center md:border-b-0 md:border-r md:pb-0 md:pr-6">
        <div className="text-4xl font-bold text-gray-900">
          {average.toFixed(1)}
        </div>
        <div className="my-2 flex justify-center">
          <StarRating value={Math.round(average)} readOnly />
        </div>
        <div className="text-sm text-gray-500">
          Based on {total} review{total !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = counts[star] || 0;
          const percentage = total ? (count / total) * 100 : 0;
          return (
            <div
              key={star}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <span className="w-16 text-xs md:text-sm">{star} star</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs text-gray-500">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingSummaryBar;

