import { EventEmitter } from 'events';

export interface RequestMetadata {
  requestId: string;
}

export declare type StorageType = Map<string, any>;
export declare type AsynchronousLocalStorage = {
    get: <T>(key: string) => T | undefined;
    set: <T>(key: string, value: T) => void;
    bindEmitter(emitter: EventEmitter): void;
    runWith: (callback: () => void, defaults?: Record<string, any>) => void;
    storageImplementation: string;
};

