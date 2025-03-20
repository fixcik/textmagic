import React from 'react';
import { FaLanguage, FaMagic, FaPowerOff } from 'react-icons/fa';
import { useEnhanceButton } from '../../hooks/useEnhanceButton';
import { useEnhanceText } from '../../hooks/useEnhanceText';
import PopupModal from '../PopupModal';
import './styles.css';

const EnhanceButton: React.FC = () => {
  // Используем кастомные хуки
  const {
    visible,
    position,
    placement,
    text,
    inputElement,
    activeTooltip,
    setActiveTooltip,
    hideButton
  } = useEnhanceButton();

  const {
    loading,
    currentAction,
    resultText,
    isPopupOpen,
    handleEnhanceText,
    handleTranslateText,
    insertResultText,
    closePopup
  } = useEnhanceText();

  // Обработчик для кнопки улучшения
  const enhanceText = () => {
    if (text && inputElement) {
      handleEnhanceText(text, inputElement);
    }
  };

  // Обработчик для кнопки перевода
  const translateText = () => {
    if (text && inputElement) {
      handleTranslateText(text, inputElement);
    }
  };

  return (
    <>
      <div 
        className={`enhance-button-wrapper ${visible ? 'visible' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      >
        <div className="buttons-wrapper">
          {/* Кнопка включения */}
          <button 
            className="power-button"
            onClick={() => {}}
            disabled={loading}
            title="Включить"
            onMouseOver={() => setActiveTooltip('power')}
            onMouseOut={() => setActiveTooltip(null)}
          >
            <FaPowerOff />
            {activeTooltip === 'power' && (
              <div className="tooltip">Включить</div>
            )}
          </button>

          {/* Кнопка улучшения текста */}
          <button 
            className="edit-button"
            onClick={enhanceText}
            disabled={loading}
            title="Улучшить"
            onMouseOver={() => setActiveTooltip('edit')}
            onMouseOut={() => setActiveTooltip(null)}
          >
            {loading && currentAction === 'enhance' ? (
              <div className="spinner-small" />
            ) : (
              <FaMagic />
            )}
            {activeTooltip === 'edit' && (
              <div className="tooltip">Улучшить</div>
            )}
          </button>

          {/* Кнопка перевода */}
          <button 
            className="translate-button"
            onClick={translateText}
            disabled={loading}
            title="Перевести"
            onMouseOver={() => setActiveTooltip('translate')}
            onMouseOut={() => setActiveTooltip(null)}
          >
            {loading && currentAction === 'translate' ? (
              <div className="spinner-small" />
            ) : (
              <FaLanguage />
            )}
            {activeTooltip === 'translate' && (
              <div className="tooltip">Перевести</div>
            )}
          </button>
        </div>

        {/* Стрелка указатель */}
        <div className={`arrow ${placement}`}></div>
      </div>

      {/* Попап с результатом улучшения/перевода */}
      <PopupModal
        isOpen={isPopupOpen}
        onClose={() => {
          closePopup();
          hideButton();
        }}
        onInsert={insertResultText}
        content={resultText}
        loading={loading}
      />

      {/* Стили для анимации спиннера */}
      {(loading || isPopupOpen) && (
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      )}
    </>
  );
};

export default EnhanceButton; 