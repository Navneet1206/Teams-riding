import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex items-center mb-4">
          {isDestructive && <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex space-x-4">
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 rounded-md ${
              isDestructive
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 border border-black rounded-md hover:bg-gray-50"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;