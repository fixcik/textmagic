import { useState } from 'react';
import { enhanceText, translateText } from '../services/openaiService';
import { notifyService } from '../services/notificationService';

interface UseEnhanceTextResult {
  loading: boolean;
  currentAction: 'enhance' | 'translate' | null;
  resultText: string;
  isPopupOpen: boolean;
  handleEnhanceText: (text: string, inputElement: HTMLInputElement | HTMLTextAreaElement) => Promise<void>;
  handleTranslateText: (text: string, inputElement: HTMLInputElement | HTMLTextAreaElement) => Promise<void>;
  insertResultText: () => void;
  closePopup: () => void;
}

export const useEnhanceText = (): UseEnhanceTextResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<'enhance' | 'translate' | null>(null);
  const [resultText, setResultText] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [activeInputElement, setActiveInputElement] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Обработчик для улучшения текста
  const handleEnhanceText = async (text: string, inputElement: HTMLInputElement | HTMLTextAreaElement) => {
    if (!text) return;

    setLoading(true);
    setCurrentAction('enhance');
    setResultText('');
    setIsPopupOpen(true);
    setActiveInputElement(inputElement);

    try {
      const response = await enhanceText(text, (progressText) => {
        setResultText(progressText);
      });

      if (!response.success) {
        notifyService.error(response.error || 'Ошибка при улучшении текста');
        setIsPopupOpen(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        notifyService.error(`Ошибка при улучшении текста: ${error.message}`);
      } else {
        notifyService.error('Произошла ошибка при улучшении текста. Проверьте консоль для деталей.');
      }
      setIsPopupOpen(false);
    } finally {
      setLoading(false);
      setCurrentAction(null);
    }
  };

  // Обработчик для перевода текста
  const handleTranslateText = async (text: string, inputElement: HTMLInputElement | HTMLTextAreaElement) => {
    if (!text) return;

    setLoading(true);
    setCurrentAction('translate');
    setResultText('');
    setIsPopupOpen(true);
    setActiveInputElement(inputElement);

    try {
      const response = await translateText(text, (progressText) => {
        setResultText(progressText);
      });

      if (!response.success) {
        notifyService.error(response.error || 'Ошибка при переводе текста');
        setIsPopupOpen(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        notifyService.error(`Ошибка при переводе текста: ${error.message}`);
      } else {
        notifyService.error('Произошла ошибка при переводе текста. Проверьте консоль для деталей.');
      }
      setIsPopupOpen(false);
    } finally {
      setLoading(false);
      setCurrentAction(null);
    }
  };

  // Функция для вставки улучшенного/переведенного текста в поле ввода
  const insertResultText = () => {
    console.log('Inserting text:', resultText);
    if (!resultText || !activeInputElement) {
      console.error('No result text to insert or no active input element');
      return;
    }

    try {
      if (activeInputElement.isConnected) {
        console.log('Input element found and connected');
        // Получаем текущие позиции курсора
        const startPos = activeInputElement.selectionStart || 0;
        const endPos = activeInputElement.selectionEnd || 0;

        // Получаем текущее значение поля ввода
        const currentValue = activeInputElement.value;

        // Формируем новое значение с вставленным текстом
        const newValue =
          currentValue.substring(0, startPos) +
          resultText +
          currentValue.substring(endPos);

        // Устанавливаем новое значение
        activeInputElement.value = newValue;

        // Устанавливаем курсор после вставленного текста
        activeInputElement.selectionStart = startPos + resultText.length;
        activeInputElement.selectionEnd = startPos + resultText.length;

        // Вызываем событие input для уведомления о изменении значения
        const event = new Event('input', { bubbles: true });
        activeInputElement.dispatchEvent(event);

        // Фокусируемся на элементе ввода
        activeInputElement.focus();
      } else {
        // Если элемент недоступен, сообщаем об ошибке
        console.error('Input element is not available or connected');
        throw new Error('Элемент ввода недоступен или был изменен');
      }
    } catch (error) {
      // Показываем детальное сообщение об ошибке
      console.error('Ошибка при вставке текста:', error);
      if (error instanceof Error) {
        notifyService.error(`Ошибка при вставке текста: ${error.message}`);
      } else {
        notifyService.error('Произошла ошибка при вставке текста. Пожалуйста, скопируйте текст вручную.');
      }
    } finally {
      closePopup();
    }
  };

  // Функция для закрытия попапа
  const closePopup = () => {
    setIsPopupOpen(false);
    setResultText('');
    setActiveInputElement(null);
  };

  return {
    loading,
    currentAction,
    resultText,
    isPopupOpen,
    handleEnhanceText,
    handleTranslateText,
    insertResultText,
    closePopup
  };
}; 