import React from 'react';
import { Star } from 'lucide-react';

interface CaptainRatingCardProps {
  rating: {
    rating: number;
    comment: string;
    user: {
      firstName: string;
      lastName: string;
    };
    createdAt: string;
  };
}

const CaptainRatingCard: React.FC<CaptainRatingCardProps> = ({ rating }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold">
            {rating.user.firstName} {rating.user.lastName}
          </p>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating.rating ? 'fill-black text-black' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {new Date(rating.createdAt).toLocaleDateString()}
        </p>
      </div>
      {rating.comment && <p className="text-gray-700 mt-2">{rating.comment}</p>}
    </div>
  );
};

export default CaptainRatingCard;