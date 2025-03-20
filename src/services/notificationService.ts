import { toast, ToastOptions } from 'react-toastify';

// Общие настройки для тостов
const defaultOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Сервис для уведомлений
export const notifyService = {
  // Успешное уведомление
  success: (message: string, options: ToastOptions = {}) => {
    return toast.success(message, {
      ...defaultOptions,
      ...options,
      className: 'notification-success',
    });
  },

  // Уведомление об ошибке
  error: (message: string, options: ToastOptions = {}) => {
    return toast.error(message, {
      ...defaultOptions,
      ...options,
      className: 'notification-error',
    });
  },

  // Информационное уведомление
  info: (message: string, options: ToastOptions = {}) => {
    return toast.info(message, {
      ...defaultOptions,
      ...options,
      className: 'notification-info',
    });
  },

  // Предупреждение
  warning: (message: string, options: ToastOptions = {}) => {
    return toast.warning(message, {
      ...defaultOptions,
      ...options,
      className: 'notification-warning',
    });
  },

  // Обычное уведомление
  plain: (message: string, options: ToastOptions = {}) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
    });
  },

  // Закрыть все уведомления
  dismissAll: () => {
    toast.dismiss();
  },
}; 