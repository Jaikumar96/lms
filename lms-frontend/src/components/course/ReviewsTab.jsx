import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewsTab = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/courses/${courseId}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const handleSubmitReview = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/courses/${courseId}/reviews`,
        { rating: parseFloat(rating), comment },
        { headers: { Authorization: token } }
      );
      setRating("");
      setComment("");
      fetchReviews(); // refresh
    } catch (err) {
      alert("Failed to submit review.");
      console.error(err);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Reviews</h3>
      <div className="space-y-4 mb-6">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold text-gray-700">{r.student?.name}</p>
            <p className="text-yellow-500">Rating: {r.rating}</p>
            <p className="text-gray-600">{r.comment}</p>
          </div>
        ))}
      </div>

      <input
        type="number"
        step="0.1"
        max="5"
        min="0"
        placeholder="Rating (0-5)"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Your review..."
        className="border p-3 rounded w-full mb-2"
      />
      <button
        onClick={handleSubmitReview}
        className="bg-purple-700 text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>
    </div>
  );
};

export default ReviewsTab;
