import React, { useEffect, useState } from 'react';
import './styles.css';

export type NotificationType = 'success' | 'error' | 'info';

export interface NotificationProps {
  type: NotificationType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ 
  type, 
  message, 
  duration = 3000, 
  onClose 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) {
        setTimeout(onClose, 300); // Задержка после анимации скрытия
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      setTimeout(onClose, 300);
    }
  };

  return (
    <div className={`notification ${type} ${visible ? 'visible' : 'hidden'}`}>
      <div className="notification-icon">
        {type === 'success' && <span>✓</span>}
        {type === 'error' && <span>✗</span>}
        {type === 'info' && <span>ℹ</span>}
      </div>
      <div className="notification-content">
        <p className="notification-message">{message}</p>
      </div>
      <button className="notification-close" onClick={handleClose}>
        ×
      </button>
    </div>
  );
};

export default Notification; 