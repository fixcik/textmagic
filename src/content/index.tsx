import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EnhanceButton from '../components/EnhanceButton';
import { calculateButtonPosition } from '../utils/selectionUtils';
import './content.css';

// Создаем контейнер для кнопки улучшения
const enhanceButtonContainer = document.createElement('div');
enhanceButtonContainer.id = 'openai-enhance-button-container';
// Добавим стили прямо в элемент для гарантии отображения
enhanceButtonContainer.style.position = 'fixed';
enhanceButtonContainer.style.top = '0';
enhanceButtonContainer.style.left = '0';
enhanceButtonContainer.style.width = '100vw';
enhanceButtonContainer.style.height = '100vh';
enhanceButtonContainer.style.pointerEvents = 'none';
enhanceButtonContainer.style.zIndex = '2147483647';

// Добавим элемент в конец body, чтобы гарантировать, что он будет поверх всего
document.body.appendChild(enhanceButtonContainer);

// Рендерим React компонент внутри контейнера
const root = ReactDOM.createRoot(enhanceButtonContainer);
root.render(
  <React.StrictMode>
    <EnhanceButton />
    <ToastContainer 
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </React.StrictMode>
);

// Обрабатываем события выделения текста
const addEventListeners = () => {
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('keyup', handleTextSelection);
};

// Добавляем небольшую задержку, чтобы убедиться, что DOM полностью загружен
setTimeout(addEventListeners, 1000);

function handleTextSelection(event: MouseEvent | KeyboardEvent) {
  // Получаем текущее выделение
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();

  if (selectedText && selection?.rangeCount) {
    // Проверяем, выделен ли текст внутри поля ввода (input или textarea)
    const activeElement = document.activeElement;
    const isInputField = activeElement instanceof HTMLInputElement || 
                          activeElement instanceof HTMLTextAreaElement;

    if (isInputField) {
      // Вычисляем позицию для отображения кнопки
      const { x: posX, y: posY, placement } = calculateButtonPosition(activeElement);
      
      // Отправляем сообщение в компонент EnhanceButton о показе кнопки
      const showEvent = new CustomEvent('show-enhance-button', { 
        detail: { 
          text: selectedText,
          position: {
            x: posX,
            y: posY
          },
          placement,
          inputElement: activeElement as HTMLInputElement | HTMLTextAreaElement
        } 
      });
      
      document.dispatchEvent(showEvent);
    } else {
      const hideEvent = new CustomEvent('hide-enhance-button');
      document.dispatchEvent(hideEvent);
    }
  } else {
    // Если текст не выделен, скрываем кнопку
    const hideEvent = new CustomEvent('hide-enhance-button');
    document.dispatchEvent(hideEvent);
  }
} 