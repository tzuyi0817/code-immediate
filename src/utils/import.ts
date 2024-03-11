import type { CompileParams, CodeContent } from '@/types/codeContent';

type Modules = keyof typeof modules;

interface ModulesMap {
  compileSfc: Record<'compileSfc', (content: CompileParams) => Promise<CodeContent>>;
}

const compileSfc = import.meta.glob('@/utils/compileSfc.ts', { query: '?url', import: 'default' });
const modules = {
  compileSfc: getModule(compileSfc),
} as const;

async function getModule(module: Record<string, () => Promise<unknown>>) {
  const key = Object.keys(module)[0];

  return (await module[key]()) as string;
}

export async function dynamicImport(module: Modules): Promise<ModulesMap[Modules]> {
  const url = await modules[module];

  return import(url);
}
