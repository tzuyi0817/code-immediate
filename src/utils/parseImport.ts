import { parse as parsePackage } from 'parse-package-name';
import type { CdnSourceMap } from '@/types/cdn';

interface PathNode {
  node: {
    source: { value: string };
    specifiers: {
      local: { name: string };
      imported?: { name: string };
    }[];
  };
  remove: () => void;
}

export function parseImport(jsCode: string) {
  const imports: CdnSourceMap[] = [];
  if (!/\bimport\b/.test(jsCode)) return { code: jsCode };

  const { code } = window.Babel.transform(jsCode, {
    plugins: [
      [getImports, { imports }],
    ]
  });
  const { statements, scripts } = transformImports(imports);

  return { code: statements + code, scripts };
}

function getImports(code: string, { imports }: { imports: CdnSourceMap[] }) {
  return {
    visitor: {
      ImportDeclaration(path: PathNode) {
        const { node: { source, specifiers } } = path;

        imports.push({
          variables: specifiers.map(({ local, imported }) => ({
            local: local.name,
            imported: imported?.name ?? 'default',
          })),
          module: source.value,
        });
        path.remove();
      }
    }
  }
}

function transformImports(imports: CdnSourceMap[]) {
  return imports.reduce(({ statements, scripts }, { variables, module }, index) => {
    const { version, path } = parsePackage(module);
    const moduleName = `__module_${index}`;

    variables.forEach(({ local, imported }) => {
      statements += `const ${local} = ${moduleName}.${imported};\n`;
      scripts += `\n<script src="https://esbuild.vercel.app/${module}@${version}${path}?format=iife&globalName=${moduleName}"><\/script>`;
    });
    return { statements, scripts };
  }, { statements: '', scripts: '' });
}
