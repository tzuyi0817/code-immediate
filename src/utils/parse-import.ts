import { parse as parsePackage } from 'parse-package-name';
import { transformToJsdelivr, transformToEsbuild } from '@/utils/cdn';
import { IMPORT_MAP_BUILD_IN_SOURCES } from '@/config/import-map';
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

interface ImportOptions {
  imports: CdnSourceMap[];
  isESM: boolean;
}

export function parseImport(jsCode: string, isESM = false) {
  if (!/\bimport\b/.test(jsCode)) return { code: jsCode };
  const imports: CdnSourceMap[] = [];
  const { code } = window.Babel.transform(jsCode, {
    plugins: [[getImports, { imports, isESM }]],
    presets: isESM ? ['react'] : ['env', 'react'],
  });
  const { statements, scripts } = transformImports(imports, isESM);

  return { code: statements + code, scripts };
}

function getImports(_code: string, { imports, isESM }: ImportOptions) {
  return {
    visitor: {
      ImportDeclaration(path: PathNode) {
        const {
          node: { source, specifiers },
        } = path;

        if (isESM && IMPORT_MAP_BUILD_IN_SOURCES.has(source.value)) return;

        imports.push({
          variables: specifiers.map(({ local, imported }) => ({
            local: local.name,
            imported: imported?.name ?? 'default',
          })),
          module: source.value,
        });
        path.remove();
      },
    },
  };
}

function transformImports(imports: CdnSourceMap[], isESM: boolean) {
  return imports.reduce(
    ({ statements, scripts }, { variables, module }, index) => {
      if (isESM) {
        const vars = variables
          .filter(({ imported }) => imported !== 'default')
          .map(({ local }) => local)
          .join(', ');
        const locals = vars ? `{ ${vars} }` : '';
        const defaultImported = variables.find(({ imported }) => imported === 'default')?.local;
        const imported = [defaultImported, locals].filter(Boolean);

        statements += `\nimport ${imported.join(', ')} from '${transformToJsdelivr(module)}'\n`;
      } else {
        const { version, path } = parsePackage(module);
        const moduleName = `__module_${index}`;

        variables.forEach(({ local, imported }) => {
          statements += `const ${local} = ${moduleName}.${imported};\n`;
          scripts += `\n<script src="${transformToEsbuild(module, version, path, moduleName)}"></script>`;
        });
      }
      return { statements, scripts };
    },
    { statements: '', scripts: '' },
  );
}
