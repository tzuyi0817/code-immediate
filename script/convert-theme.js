import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { convertThemeFromDir } from 'vscode-theme-to-monaco-theme-node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(function () {
  try {
    convertThemeFromDir(resolve(__dirname, './vscodeThemes'), resolve(__dirname, '../public/themes'));
  } catch (error) {
    throw new Error(error);
  }
})();
