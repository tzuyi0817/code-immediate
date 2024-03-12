import compileUrl from '@/utils/compile.ts?url';
import compileSfcUrl from '@/utils/compileSfc.ts?url';
import type { CompileParams, CodeContent } from '@/types/codeContent';

type Modules = keyof typeof modules;

interface ModulesMap {
  compileSfc: Record<'compileSfc', (content: CompileParams) => Promise<CodeContent>>;
  compile: Record<'compile', (params: CompileParams) => Promise<CodeContent>>;
}

const modules = {
  compileSfc: compileSfcUrl,
  compile: compileUrl,
} as const;

export function dynamicImport<T extends Modules>(module: T): Promise<ModulesMap[T]> {
  const url = modules[module];

  return import(url);
}
