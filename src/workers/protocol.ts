import type { VueCompilerOptions } from '@vue/language-core';

/** 主執行緒送出的第一則訊息，要求 worker 開始載入 TypeScript */
export const WORKER_INIT = 'initializing';

/** worker 載入完 TypeScript 並註冊好處理器後回報；主執行緒收到才可送出 CreateData */
export const WORKER_READY = 'loading finished';

export interface CreateData {
  tsconfig: {
    /** 未經轉換的 tsconfig JSON，worker 內以 ts.convertCompilerOptionsFromJson 轉成 CompilerOptions */
    compilerOptions?: Record<string, unknown>;
    vueCompilerOptions?: Partial<VueCompilerOptions>;
  };
}
