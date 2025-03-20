import React, { useState, useEffect } from 'react';
import { checkApiKey } from '../services/openaiService';
import { DEFAULT_CONFIG, getConfig, saveConfig } from '../services/configService';
import { notifyService } from '../services/notificationService';
import { AppConfig } from '../types/index';

interface PopupProps {}

const Popup: React.FC<PopupProps> = () => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'api' | 'prompts'>('api');
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  
  useEffect(() => {
    // Загружаем сохраненную конфигурацию
    const loadConfig = async () => {
      try {
        const savedConfig = await getConfig();
        // Убедимся, что все необходимые поля есть в конфигурации
        const configWithDefaults = {
          ...DEFAULT_CONFIG,
          ...savedConfig,
          prompts: {
            ...DEFAULT_CONFIG.prompts,
            ...savedConfig.prompts
          }
        };
        setConfig(configWithDefaults);
      } catch (error) {
        console.error('Ошибка при загрузке конфигурации:', error);
        setConfig(DEFAULT_CONFIG);
      }
    };
    
    loadConfig();
  }, []);

  const handleSave = async () => {
    setIsChecking(true);
    
    try {
      const isValid = await checkApiKey(config.openaiApiKey);
      
      if (isValid) {
        // Сохраняем конфигурацию в хранилище Chrome
        await saveConfig(config);
        notifyService.success('Настройки успешно сохранены!');
      } else {
        notifyService.error('Неверный API ключ. Пожалуйста, проверьте и попробуйте снова.');
      }
    } catch (error) {
      notifyService.error('Произошла ошибка при проверке API ключа.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    if (id === 'apiKey') {
      setConfig(prev => ({ ...prev, openaiApiKey: value }));
    } else if (id.startsWith('prompts.')) {
      // Разбираем id для обновления вложенных свойств
      const path = id.split('.');
      if (path.length === 3) { // prompts.enhance.system
        const [_, category, field] = path;
        setConfig(prev => ({
          ...prev,
          prompts: {
            ...prev.prompts,
            [category]: {
              ...prev.prompts[category as keyof typeof prev.prompts],
              [field]: value
            }
          }
        }));
      }
    }
  };

  const togglePrompt = (promptKey: string) => {
    setExpandedPrompt(expandedPrompt === promptKey ? null : promptKey);
  };

  return (
    <div className="popup-container">
      <div className="popup-header">
        <div className="header-icon-wrapper">
          <svg className="magic-wand-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
            <path d="M24 6L26 13.5L33.5 16L26 18.5L24 26L22 18.5L14.5 16L22 13.5L24 6Z" fill="white"/>
            <path d="M11 33L38 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M11 33L18 40" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h1>TextMagic</h1>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'api' ? 'active' : ''}`} 
          onClick={() => setActiveTab('api')}
        >
          API Ключ
        </button>
        <button 
          className={`tab ${activeTab === 'prompts' ? 'active' : ''}`} 
          onClick={() => setActiveTab('prompts')}
        >
          Промпты
        </button>
      </div>
      
      {activeTab === 'api' ? (
        <div className="tab-content">
          <div className="form-group">
            <label htmlFor="apiKey">OpenAI API Key:</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="apiKey"
                value={config.openaiApiKey}
                onChange={handleInputChange}
                placeholder="Введите ваш OpenAI API ключ"
                disabled={isChecking}
              />
            </div>
          </div>
          
          <button className="save-button" onClick={handleSave} disabled={isChecking}>
            {isChecking ? 'Проверка...' : 'Сохранить'}
          </button>
          
          <div className="instructions">
            <h2>Как использовать:</h2>
            <ol className="steps-list">
              <li>Введите ваш OpenAI API ключ выше и нажмите "Сохранить"</li>
              <li>Выделите текст на любой веб-странице</li>
              <li>Нажмите на появившуюся кнопку "Улучшить" с иконкой волшебной палочки</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="tab-content">
          <div className="prompts-container">
            <div className="prompt-section">
              <h3 onClick={() => togglePrompt('enhance')}>
                <span className="prompt-icon">✨</span>
                Улучшение текста 
                <span className="toggle-icon">{expandedPrompt === 'enhance' ? '▼' : '▶'}</span>
              </h3>
              
              {expandedPrompt === 'enhance' && (
                <div className="prompt-inputs">
                  <div className="form-group">
                    <label htmlFor="prompts.enhance.system">Системный промпт:</label>
                    <textarea
                      id="prompts.enhance.system"
                      value={config.prompts.enhance.system}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prompts.enhance.user">Пользовательский промпт:</label>
                    <textarea
                      id="prompts.enhance.user"
                      value={config.prompts.enhance.user}
                      onChange={handleInputChange}
                      rows={3}
                    />
                    <p className="prompt-hint">Используйте {'{text}'} для подстановки выделенного текста</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="prompt-section">
              <h3 onClick={() => togglePrompt('translate')}>
                <span className="prompt-icon">🇬🇧</span>
                Перевод на английский
                <span className="toggle-icon">{expandedPrompt === 'translate' ? '▼' : '▶'}</span>
              </h3>
              
              {expandedPrompt === 'translate' && (
                <div className="prompt-inputs">
                  <div className="form-group">
                    <label htmlFor="prompts.translate.system">Системный промпт:</label>
                    <textarea
                      id="prompts.translate.system"
                      value={config.prompts.translate.system}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prompts.translate.user">Пользовательский промпт:</label>
                    <textarea
                      id="prompts.translate.user"
                      value={config.prompts.translate.user}
                      onChange={handleInputChange}
                      rows={3}
                    />
                    <p className="prompt-hint">Используйте {'{text}'} для подстановки выделенного текста</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="prompt-section">
              <h3 onClick={() => togglePrompt('translateToRussian')}>
                <span className="prompt-icon">🇷🇺</span>
                Перевод на русский
                <span className="toggle-icon">{expandedPrompt === 'translateToRussian' ? '▼' : '▶'}</span>
              </h3>
              
              {expandedPrompt === 'translateToRussian' && (
                <div className="prompt-inputs">
                  <div className="form-group">
                    <label htmlFor="prompts.translateToRussian.system">Системный промпт:</label>
                    <textarea
                      id="prompts.translateToRussian.system"
                      value={config.prompts.translateToRussian.system}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prompts.translateToRussian.user">Пользовательский промпт:</label>
                    <textarea
                      id="prompts.translateToRussian.user"
                      value={config.prompts.translateToRussian.user}
                      onChange={handleInputChange}
                      rows={3}
                    />
                    <p className="prompt-hint">Используйте {'{text}'} для подстановки выделенного текста</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button className="save-button" onClick={handleSave} disabled={isChecking}>
            {isChecking ? 'Сохранение...' : 'Сохранить промпты'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Popup; 