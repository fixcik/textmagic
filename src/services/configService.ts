import { AppConfig } from '../types/index';

// Дефолтные значения промптов
export const DEFAULT_CONFIG: AppConfig = {
  openaiApiKey: '',
  prompts: {
    enhance: {
      system: 'Ты помощник, который улучшает текст, делая его более ясным, профессиональным и читабельным, сохраняя исходный смысл, тон и язык. Если текст на английском - улучшение должно быть на английском. Если текст на русском - улучшение должно быть на русском. Не переводи текст на другой язык. Не добавляй кавычки в результат.',
      user: 'Улучши следующий текст (верни только улучшенный текст без кавычек): {text}'
    },
    translate: {
      system: 'Ты переводчик, который переводит текст с русского на английский, сохраняя исходный смысл и стиль. Не добавляй кавычки в переведенный текст.',
      user: 'Переведи следующий текст на английский (верни только перевод без кавычек): {text}'
    },
    translateToRussian: {
      system: 'Ты переводчик, который переводит текст с английского на русский, сохраняя исходный смысл и стиль. Не добавляй кавычки в переведенный текст.',
      user: 'Переведи следующий текст на русский (верни только перевод без кавычек): {text}'
    }
  }
};

// Получение конфигурации из хранилища Chrome
export const getConfig = async (): Promise<AppConfig> => {
  try {
    const result = await chrome.storage.sync.get(['openaiConfig']);

    if (result.openaiConfig) {
      // Проверяем наличие всех необходимых полей и добавляем недостающие
      const savedConfig = result.openaiConfig as AppConfig;

      // Проверка наличия всех категорий промптов
      if (!savedConfig.prompts) {
        savedConfig.prompts = DEFAULT_CONFIG.prompts;
      }

      // Проверка и добавление недостающих категорий
      if (!savedConfig.prompts.enhance) {
        savedConfig.prompts.enhance = DEFAULT_CONFIG.prompts.enhance;
      }

      if (!savedConfig.prompts.translate) {
        savedConfig.prompts.translate = DEFAULT_CONFIG.prompts.translate;
      }

      if (!savedConfig.prompts.translateToRussian) {
        savedConfig.prompts.translateToRussian = DEFAULT_CONFIG.prompts.translateToRussian;
      }

      // Проверка полей в каждой категории
      if (!savedConfig.prompts.enhance.system || !savedConfig.prompts.enhance.user) {
        savedConfig.prompts.enhance = DEFAULT_CONFIG.prompts.enhance;
      }

      if (!savedConfig.prompts.translate.system || !savedConfig.prompts.translate.user) {
        savedConfig.prompts.translate = DEFAULT_CONFIG.prompts.translate;
      }

      if (!savedConfig.prompts.translateToRussian.system || !savedConfig.prompts.translateToRussian.user) {
        savedConfig.prompts.translateToRussian = DEFAULT_CONFIG.prompts.translateToRussian;
      }

      return savedConfig;
    }

    // Попробуем получить старый ключ API и создать новую конфигурацию
    const apiKeyResult = await chrome.storage.sync.get(['openaiApiKey']);
    if (apiKeyResult.openaiApiKey) {
      const newConfig: AppConfig = {
        ...DEFAULT_CONFIG,
        openaiApiKey: apiKeyResult.openaiApiKey
      };

      // Сохраняем новую конфигурацию
      await saveConfig(newConfig);
      return newConfig;
    }

    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('Ошибка при получении конфигурации:', error);
    return DEFAULT_CONFIG;
  }
};

// Сохранение конфигурации в хранилище Chrome
export const saveConfig = async (config: AppConfig): Promise<boolean> => {
  try {
    await chrome.storage.sync.set({ openaiConfig: config });
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении конфигурации:', error);
    return false;
  }
};

// Получение API ключа из конфигурации
export const getApiKey = async (): Promise<string | null> => {
  const config = await getConfig();
  return config.openaiApiKey || null;
};

// Сохранение API ключа в конфигурацию
export const saveApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const config = await getConfig();
    const newConfig: AppConfig = {
      ...config,
      openaiApiKey: apiKey
    };

    return await saveConfig(newConfig);
  } catch (error) {
    console.error('Ошибка при сохранении API ключа:', error);
    return false;
  }
}; 