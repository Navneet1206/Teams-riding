import React from 'react';
import { CreditCard, Wallet } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selected: 'cash' | 'online';
  onSelect: (method: 'cash' | 'online') => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selected,
  onSelect
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => onSelect('cash')}
        className={`p-4 rounded-lg border ${
          selected === 'cash'
            ? 'border-black bg-black text-white'
            : 'border-gray-200 hover:border-black'
        }`}
      >
        <Wallet className="w-6 h-6 mx-auto mb-2" />
        <p className="text-sm font-medium">Cash Payment</p>
      </button>

      <button
        onClick={() => onSelect('online')}
        className={`p-4 rounded-lg border ${
          selected === 'online'
            ? 'border-black bg-black text-white'
            : 'border-gray-200 hover:border-black'
        }`}
      >
        <CreditCard className="w-6 h-6 mx-auto mb-2" />
        <p className="text-sm font-medium">Online Payment</p>
      </button>
    </div>
  );
};

export default PaymentMethodSelector;