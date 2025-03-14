import React from 'react';
import './ErrorMessage.scss';

interface ErrorMessageProps {
  message: string;
  onRetry?: (() => void) | (() => Promise<void>) | undefined;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const handleRetry = async () => {
    if (onRetry) {
      await onRetry();
    }
  };

  return (
    <div className="error-message">
      <p>{message}</p>
      {onRetry && (
        <button className="retry-button" onClick={handleRetry}>
          再試行
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
