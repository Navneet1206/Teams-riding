import React from 'react';
import { Car } from 'lucide-react';

interface VehicleCardProps {
  type: 'hatchback' | 'sedan' | 'suv' | 'muv';
  baseRate: number;
  selected: boolean;
  onSelect: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ type, baseRate, selected, onSelect }) => {
  const getSeats = () => {
    switch (type) {
      case 'hatchback':
      case 'sedan':
        return '4 seats';
      case 'suv':
        return '7 seats';
      case 'muv':
        return '7-9 seats';
      default:
        return '';
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer p-4 rounded-lg transition-all ${
        selected
          ? 'bg-black text-white'
          : 'bg-white border border-gray-200 hover:border-black'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <Car className="w-6 h-6" />
        <span className="text-sm font-medium">₹{baseRate}/km</span>
      </div>
      
      <h3 className="text-lg font-semibold capitalize mb-1">
        {type}
      </h3>
      
      <p className={`text-sm ${selected ? 'text-gray-200' : 'text-gray-600'}`}>
        {getSeats()}
      </p>
    </div>
  );
};

export default VehicleCard;