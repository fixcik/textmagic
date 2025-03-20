export interface Position {
  x: number;
  y: number;
}

export interface ShowButtonEvent {
  detail: {
    text: string;
    position: Position;
    placement: 'top' | 'bottom';
    inputElement: HTMLInputElement | HTMLTextAreaElement;
  };
}

// Типы для PopupModal
export interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: () => void;
  content: string;
  loading: boolean;
}

// Типы для EnhanceButton
export interface EnhanceButtonProps {
  // Если потребуются пропсы для компонента, их можно добавить здесь
}

// Тип для API ответа
export interface ApiResponse {
  success: boolean;
  data?: string;
  error?: string;
}

// Конфигурация приложения
export interface AppConfig {
  openaiApiKey: string;
  prompts: {
    enhance: {
      system: string;
      user: string;
    };
    translate: {
      system: string;
      user: string;
    };
    translateToRussian: {
      system: string;
      user: string;
    };
  };
} 