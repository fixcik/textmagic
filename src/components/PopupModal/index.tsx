import React, { useState, useEffect } from 'react';
import { PopupModalProps } from '../../types/index';
import { notifyService } from '../../services/notificationService';
import { FaCopy, FaTimes, FaPaste } from 'react-icons/fa';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalHeaderTitle,
  ModalHeaderIcon,
  ModalCloseIcon,
  ModalBody,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  ResultTextarea,
  ButtonContainer,
  CloseButton,
  CopyButton,
  InsertButton,
  ButtonIcon
} from './styles';

const PopupModal: React.FC<PopupModalProps> = ({ isOpen, onClose, onInsert, content, loading }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
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
    
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 280);
  };

  return (
    <ModalOverlay onClick={handleClose} isClosing={isClosing}>
      <ModalContent
        onClick={(e) => {
          e.stopPropagation();
        }}
        isClosing={isClosing}
      >
        <ModalHeader>
          <ModalHeaderTitle>
            <ModalHeaderIcon><FaCopy /></ModalHeaderIcon>
            {loading ? 'Обработка текста' : 'Результат обработки'}
          </ModalHeaderTitle>
          <ModalCloseIcon onClick={handleClose}><FaTimes /></ModalCloseIcon>
        </ModalHeader>
        
        <ModalBody>
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>Обработка текста...</LoadingText>
            </LoadingContainer>
          ) : (
            <>
              <ResultTextarea
                value={content}
                onChange={(e) => {
                  // Позволяем редактировать текст
                  // Но на данный момент не сохраняем изменения
                }}
                readOnly={false}
                onClick={(e) => {
                  (e.target as HTMLTextAreaElement).select();
                }}
              />
              <ButtonContainer>
                <CloseButton onClick={handleClose}>
                  <ButtonIcon><FaTimes /></ButtonIcon>
                  Закрыть
                </CloseButton>
                <CopyButton onClick={copyText}>
                  <ButtonIcon><FaCopy /></ButtonIcon>
                  Копировать
                </CopyButton>
                <InsertButton onClick={handleInsert}>
                  <ButtonIcon><FaPaste /></ButtonIcon>
                  Вставить
                </InsertButton>
              </ButtonContainer>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PopupModal; 