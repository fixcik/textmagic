// Для работы с chrome API
interface ChromeStorage {
  sync: {
    get: (keys: string | string[] | object, callback: (items: any) => void) => void;
    set: (items: object, callback?: () => void) => void;
  };
}

interface ChromeRuntime {
  onMessage: {
    addListener: (
      callback: (
        message: any,
        sender: any,
        sendResponse: (response?: any) => void
      ) => void
    ) => void;
  };
  onInstalled: {
    addListener: (callback: () => void) => void;
  };
}

interface Chrome {
  storage: ChromeStorage;
  runtime: ChromeRuntime;
}

declare global {
  interface Window {
    chrome: Chrome;
  }
  const chrome: Chrome;
}

// Для работы с JSON импортами
declare module "*.json" {
  const value: any;
  export default value;
} 