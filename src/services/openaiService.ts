import { OpenAI } from 'openai';
import { ApiResponse } from '../types/index';
import { getConfig, getApiKey as getApiKeyFromConfig } from './configService';
import { detectLanguage } from '../utils/textUtils';

// Создание экземпляра OpenAI SDK
export const createOpenAIClient = (apiKey: string): OpenAI => {
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Разрешаем использование в браузере
  });
};

// Проверка валидности API ключа
export const checkApiKey = async (key: string): Promise<boolean> => {
  if (!key || key.trim() === '') return false;

  try {
    const openai = createOpenAIClient(key);
    await openai.models.list();
    return true;
  } catch (error) {
    console.error('Ошибка при проверке API ключа:', error);
    return false;
  }
};

// Улучшение текста с использованием GPT
export const enhanceText = async (
  text: string,
  onProgress: (text: string) => void
): Promise<ApiResponse> => {
  try {
    const apiKey = await getApiKeyFromConfig();

    if (!apiKey) {
      return {
        success: false,
        error: 'Пожалуйста, добавьте OpenAI API ключ в настройках расширения'
      };
    }

    // Получаем промпты из конфигурации
    const config = await getConfig();
    const systemPrompt = config.prompts.enhance.system;
    const userPrompt = config.prompts.enhance.user.replace('{text}', text);

    const openai = createOpenAIClient(apiKey);
    let enhancedText = '';

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';

      if (content) {
        // Очищаем контент от кавычек, если они есть в начале или конце строки
        const cleanContent = content.replace(/^["']|["']$/g, '');
        enhancedText += cleanContent;

        // Обновляем прогресс
        onProgress(enhancedText);
      }
    }

    return { success: true, data: enhancedText };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при улучшении текста';
    console.error('Ошибка при улучшении текста:', error);
    return { success: false, error: errorMessage };
  }
};

// Перевод текста с использованием GPT с автоопределением языка
export const translateText = async (
  text: string,
  onProgress: (text: string) => void
): Promise<ApiResponse> => {
  try {
    const apiKey = await getApiKeyFromConfig();

    if (!apiKey) {
      return {
        success: false,
        error: 'Пожалуйста, добавьте OpenAI API ключ в настройках расширения'
      };
    }

    // Определяем язык текста
    const language = detectLanguage(text);

    // Получаем промпты из конфигурации в зависимости от языка
    const config = await getConfig();
    let systemPrompt;
    let userPrompt;

    if (language === 'ru') {
      // Если текст на русском, используем промпты для перевода на английский
      systemPrompt = config.prompts.translate.system;
      userPrompt = config.prompts.translate.user.replace('{text}', text);
    } else {
      // Если текст на английском (или другом языке), используем промпты для перевода на русский
      systemPrompt = config.prompts.translateToRussian.system;
      userPrompt = config.prompts.translateToRussian.user.replace('{text}', text);
    }

    const openai = createOpenAIClient(apiKey);
    let translatedText = '';

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';

      if (content) {
        // Очищаем контент от кавычек, если они есть в начале или конце строки
        const cleanContent = content.replace(/^["']|["']$/g, '');
        translatedText += cleanContent;

        // Обновляем прогресс
        onProgress(translatedText);
      }
    }

    return { success: true, data: translatedText };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при переводе текста';
    console.error('Ошибка при переводе текста:', error);
    return { success: false, error: errorMessage };
  }
}; 