import React from 'react';
import { Clock, CheckCircle, XCircle, Navigation } from 'lucide-react';

interface RideStatusBadgeProps {
  status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
}

const RideStatusBadge: React.FC<RideStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending',
          className: 'bg-gray-100 text-gray-800'
        };
      case 'accepted':
        return {
          icon: CheckCircle,
          text: 'Accepted',
          className: 'bg-black text-white'
        };
      case 'ongoing':
        return {
          icon: Navigation,
          text: 'On Trip',
          className: 'bg-black text-white'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          text: 'Completed',
          className: 'bg-black text-white'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          text: 'Cancelled',
          className: 'bg-gray-100 text-gray-800'
        };
      default:
        return {
          icon: Clock,
          text: status,
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const { icon: Icon, text, className } = getStatusConfig();

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full ${className}`}>
      <Icon className="w-4 h-4 mr-1" />
      <span className="text-sm">{text}</span>
    </div>
  );
};

export default RideStatusBadge;