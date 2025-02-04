import React from 'react';
import axios from 'axios';

interface RazorpayButtonProps {
  amount: number;
  rideId: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  amount,
  rideId,
  onSuccess,
  onError
}) => {
  const handlePayment = async () => {
    try {
      const { data: order } = await axios.post('/api/payments/create-order', {
        amount
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'RideShare',
        description: 'Ride Payment',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await axios.post('/api/payments/verify', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              rideId
            });
            onSuccess();
          } catch (error) {
            onError(error as Error);
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#000000'
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      onError(error as Error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
    >
      Pay Now
    </button>
  );
};

export default RazorpayButton;