import type { CompileParams, CodeContent } from '@/types/codeContent';

type Modules = keyof typeof modules;

interface ModulesMap {
  compileSfc: Record<'compileSfc', (content: CompileParams) => Promise<CodeContent>>;
  compile: Record<'compile', (params: CompileParams) => Promise<CodeContent>>;
}

const modules = {
  compileSfc: import('@/utils/compileSfc.ts?url'),
  compile: import('@/utils/compile.ts?url'),
} as const;

export async function dynamicImport<T extends Modules>(module: T): Promise<ModulesMap[T]> {
  const { default: url } = await modules[module];

  return import(url);
}
