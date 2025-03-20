import React, { useState, useEffect } from 'react';
import { PopupModalProps } from '../../types/index';
import { notifyService } from '../../services/notificationService';
import './styles.css';

const PopupModal: React.FC<PopupModalProps> = ({ isOpen, onClose, onInsert, content, loading }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);
  
  if (!isOpen && !isVisible) return null;

  // Функция для копирования текста
  const copyText = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Создаем временный элемент textarea
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      
      // Пытаемся скопировать в буфер обмена
      document.execCommand('copy');
      
      // Удаляем временный элемент
      document.body.removeChild(textArea);
      
      notifyService.success('Текст скопирован в буфер обмена');
    } catch (error) {
      console.error('Ошибка при копировании текста:', error);
      notifyService.error('Не удалось скопировать текст. Пожалуйста, выделите его вручную и скопируйте (Ctrl+C/Cmd+C)');
    }
  };

  // Обработчик для кнопки Вставить
  const handleInsert = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onInsert();
  };

  // Обработчик для кнопки Закрыть
  const handleClose = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Добавляем класс для анимации исчезновения
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
      modalContent.classList.add('modal-closing');
      // Закрываем после завершения анимации
      setTimeout(() => {
        onClose();
      }, 280);
    } else {
      onClose();
    }
  };

  return (
    <div className={`modal-overlay ${!isOpen ? 'modal-overlay-closing' : ''}`} onClick={handleClose}>
      <div 
        className={`modal-content ${!isOpen ? 'modal-closing' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="modal-header">
          <div className="modal-header-title">
            <span className="modal-header-icon">📝</span>
            {loading ? 'Обработка текста' : 'Результат обработки'}
          </div>
          <span className="modal-close-icon" onClick={handleClose}>✕</span>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Обработка текста...</p>
            </div>
          ) : (
            <>
              <textarea
                className="result-textarea"
                value={content}
                onChange={(e) => {
                  // Позволяем редактировать текст
                  // Но на данный момент не сохраняем изменения
                }}
                readOnly={false}
                onClick={(e) => {
                  (e.target as HTMLTextAreaElement).select();
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#f7f7f7',
                  color: '#333',
                  border: '2px solid #d0d0d0',
                  fontWeight: 500
                }}
              />
              <div className="button-container">
                <button 
                  className="close-button"
                  onClick={handleClose}
                >
                  <span className="button-icon">✕</span>
                  Закрыть
                </button>
                <button 
                  className="copy-button"
                  onClick={copyText}
                >
                  <span className="button-icon">📋</span>
                  Копировать
                </button>
                <button 
                  className="insert-button"
                  onClick={handleInsert}
                >
                  <span className="button-icon">↪</span>
                  Вставить
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Добавляем анимации */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .modal-overlay-closing {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .modal-closing {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default PopupModal; 