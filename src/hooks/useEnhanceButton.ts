import { useState, useEffect } from 'react';
import { Position, ShowButtonEvent } from '../types/index';

interface UseEnhanceButtonResult {
  visible: boolean;
  position: Position;
  placement: 'top' | 'bottom';
  text: string;
  inputElement: HTMLInputElement | HTMLTextAreaElement | null;
  activeTooltip: string | null;
  setActiveTooltip: (tooltip: string | null) => void;
  hideButton: () => void;
}

export const useEnhanceButton = (): UseEnhanceButtonResult => {
  const [visible, setVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top');
  const [text, setText] = useState<string>('');
  const [inputElement, setInputElement] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    // Обработчик для отображения кнопки
    const handleShowButton = (event: CustomEvent<ShowButtonEvent['detail']>) => {
      setVisible(true);
      setText(event.detail.text);
      setPosition(event.detail.position);
      setPlacement(event.detail.placement);
      setInputElement(event.detail.inputElement);
    };

    // Обработчик для скрытия кнопки
    const handleHideButton = () => {
      setVisible(false);
    };

    // Регистрируем обработчики событий
    document.addEventListener('show-enhance-button', handleShowButton as EventListener);
    document.addEventListener('hide-enhance-button', handleHideButton);

    // Удаляем обработчики при размонтировании компонента
    return () => {
      document.removeEventListener('show-enhance-button', handleShowButton as EventListener);
      document.removeEventListener('hide-enhance-button', handleHideButton);
    };
  }, []);

  // Функция для скрытия кнопки
  const hideButton = () => {
    setVisible(false);
  };

  return {
    visible,
    position,
    placement,
    text,
    inputElement,
    activeTooltip,
    setActiveTooltip,
    hideButton
  };
}; 