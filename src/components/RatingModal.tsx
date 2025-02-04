import React, { useState } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';

interface RatingModalProps {
  rideId: string;
  captainName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  rideId,
  captainName,
  onClose,
  onSuccess
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/ratings', { rideId, rating, comment });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Rate Your Ride with {captainName}</h2>
        
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setRating(value)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 ${
                  value <= rating ? 'fill-black text-black' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (optional)"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 h-32 resize-none"
        />

        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-300"
          >
            Submit Rating
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-black rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;