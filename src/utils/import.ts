import type { CompileParams, CodeContent } from '@/types/codeContent';

type CompileSfcModule = Record<'compileSfc', (content: CompileParams) => Promise<CodeContent>>;

const compileSfc = import.meta.glob<CompileSfcModule>('@/utils/compileSfc.ts', { query: '?url', import: 'default' });
const modules = {
  compileSfc: transformModule(compileSfc),
} as const;

function transformModule<T>(module: Record<string, () => Promise<T>>) {
  const url = Object.keys(module)[0];

  return module[url];
}

export function dynamicImport(module: keyof typeof modules) {
  return modules[module]();
}
