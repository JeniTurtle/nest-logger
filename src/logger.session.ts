import { createNamespace } from 'cls-hooked'
import { AsynchronousLocalStorage } from './logger.interface';

const _namespace = createNamespace('@jiaxinjiang/als')

export const cls: AsynchronousLocalStorage = {
  storageImplementation: 'cls-hooked',
  
  get: <T>(key: string): T | undefined => {
    if (_namespace.active) {
      return _namespace.get(key)
    }
    return undefined
  },

  set: <T>(key: string, value: T) => {
    if (_namespace.active) {
      _namespace.set(key, value)
    }
  },

  bindEmitter: (emitter) => {
    _namespace.bindEmitter(emitter);
  },

  runWith: (callback: () => void, defaults?: Record<string, any>) => {
    _namespace.run(() => {
      if (defaults) {
        const objectKeys = Object.keys(defaults)
        for (let i = 0; i < objectKeys.length; i++) {
          _namespace.set(objectKeys[i], defaults[objectKeys[i]])
        }
      }
      callback()
    })
  },
}

export default cls