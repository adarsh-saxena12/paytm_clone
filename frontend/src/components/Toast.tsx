import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  type?: 'success' | 'error';
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  visible, 
  onClose, 
  type = 'success',
  duration = 3000 
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onClose, duration]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-slide-up">
      <div className={`flex items-center p-4 rounded-lg shadow-lg ${
        type === 'success' 
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
          : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
      }`}>
        <div className="mr-3">
          {type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-white" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-xs font-bold">!</span>
            </div>
          )}
        </div>
        <p className="text-sm font-medium">{message}</p>
        <button 
          onClick={onClose}
          className="ml-4 text-white opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;