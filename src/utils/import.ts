import type { CompileParams, CodeContent } from '@/types/codeContent';

type Modules = keyof typeof modules;

interface ModulesMap {
  compileSfc: Record<'compileSfc', (content: CompileParams) => Promise<CodeContent>>;
  compile: Record<'compile', (params: CompileParams) => Promise<CodeContent>>;
}

const compileSfc = import.meta.glob('@/utils/compileSfc.ts', { query: '?url', import: 'default' });
const compile = import.meta.glob('@/utils/compile.ts', { query: '?url', import: 'default' });
const modules = {
  compileSfc: getModule(compileSfc),
  compile: getModule(compile),
} as const;

async function getModule(module: Record<string, () => Promise<unknown>>) {
  const key = Object.keys(module)[0];

  return module[key]();
}

export async function dynamicImport<T extends Modules>(module: T): Promise<ModulesMap[T]> {
  const url = (await modules[module]) as string;

  return import(url);
}
