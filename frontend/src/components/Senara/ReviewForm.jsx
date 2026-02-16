import React, { useState } from 'react';
import StarRating from './StarRating';

const initialState = {
  rating: 0,
  title: '',
  comment: '',
};

const ReviewForm = ({ onSubmit, submitting = false }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setForm((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.rating || !form.comment.trim()) {
      setError('Please select a rating and write a short review.');
      return;
    }

    if (onSubmit) {
      onSubmit(form);
    }

    setForm(initialState);
  };

  return (
    <div className="mt-5 rounded-lg bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-gray-900">
        Write a review
      </h3>

      {error && (
        <div className="mb-4 rounded-md border-l-4 border-red-500 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Rating *
          </label>
          <StarRating value={form.rating} onChange={handleRatingChange} />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Headline</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Summarize your review in a few words"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Your review *
          </label>
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            rows="4"
            placeholder="What did you like or dislike? How is the eco-friendliness and quality?"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center justify-start gap-2 pt-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;

