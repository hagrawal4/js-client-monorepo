import { Log } from './Log';

export type StorageProvider = {
  _getProviderName: () => string;
  _getItem: (key: string) => Promise<string | null>;
  _setItem: (key: string, value: string) => Promise<void>;
  _removeItem: (key: string) => Promise<void>;
  _getAllKeys: () => Promise<readonly string[]>;

  _getItemSync?: (key: string) => string | null;
};

type StorageProviderManagment = {
  _setProvider: (newProvider: StorageProvider) => void;
  _setDisabled: (isDisabled: boolean) => void;
};

const inMemoryStore: Record<string, string> = {};

const _resolve = <T>(input?: unknown) => Promise.resolve<T>(input as T);

const _inMemoryProvider: StorageProvider = {
  _getProviderName: () => 'InMemory',
  _getItemSync(key: string): string | null {
    return inMemoryStore[key] ?? null;
  },
  _getItem(key: string): Promise<string | null> {
    return _resolve(inMemoryStore[key] ?? null);
  },
  _setItem(key: string, value: string): Promise<void> {
    inMemoryStore[key] = value;
    return _resolve();
  },
  _removeItem(key: string): Promise<void> {
    delete inMemoryStore[key];
    return _resolve();
  },
  _getAllKeys(): Promise<readonly string[]> {
    return _resolve(Object.keys(inMemoryStore));
  },
};

let _localStorageProvider: StorageProvider | null = null;
try {
  if (typeof window !== 'undefined' && 'localStorage' in window) {
    _localStorageProvider = {
      _getProviderName: () => 'LocalStorage',
      _getItemSync(key: string): string | null {
        return localStorage.getItem(key);
      },
      _getItem(key: string): Promise<string | null> {
        return _resolve(localStorage.getItem(key));
      },
      _setItem(key: string, value: string): Promise<void> {
        localStorage.setItem(key, value);
        return _resolve();
      },
      _removeItem(key: string): Promise<void> {
        localStorage.removeItem(key);
        return _resolve();
      },
      _getAllKeys(): Promise<string[]> {
        const keys = Object.keys(localStorage);
        return _resolve(keys);
      },
    };
  }
} catch (error) {
  Log.warn('Failed to setup localStorageProvider.');
}

let _main: StorageProvider = _localStorageProvider ?? _inMemoryProvider;
let _current = _main;

function _inMemoryBreaker<T>(get: () => T) {
  try {
    return get();
  } catch (error) {
    if (error instanceof Error && error.name === 'SecurityError') {
      Storage._setProvider(_inMemoryProvider);
      return null;
    }
    throw error;
  }
}

export const Storage: StorageProvider & StorageProviderManagment = {
  _getProviderName: () => _current._getProviderName(),

  _getItem: async (key: string) =>
    _inMemoryBreaker(() => _current._getItem(key)),

  _getItemSync: (key: string) =>
    _inMemoryBreaker(() => _current._getItemSync?.(key) ?? null),

  _setItem: (key: string, value: string) => _current._setItem(key, value),
  _removeItem: (key: string) => _current._removeItem(key),
  _getAllKeys: () => _current._getAllKeys(),

  // StorageProviderManagment
  _setProvider: (newProvider: StorageProvider) => {
    _main = newProvider;
    _current = newProvider;
  },

  _setDisabled: (isDisabled: boolean) => {
    if (isDisabled) {
      _current = _inMemoryProvider;
    } else {
      _current = _main;
    }
  },
};

export async function _getObjectFromStorage<T>(key: string): Promise<T | null> {
  const value = await Storage._getItem(key);
  return JSON.parse(value ?? 'null') as T | null;
}

export async function _setObjectInStorage(
  key: string,
  obj: unknown,
): Promise<void> {
  await Storage._setItem(key, JSON.stringify(obj));
}
