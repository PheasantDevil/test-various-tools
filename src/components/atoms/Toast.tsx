import React, { useEffect } from 'react';
import './Toast.scss';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
  isVisible,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isVisible) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [duration, isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type} ${isVisible ? 'visible' : ''}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Toast;
