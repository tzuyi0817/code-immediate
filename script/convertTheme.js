import { convertThemeFromDir } from 'vscode-theme-to-monaco-theme-node';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(function () {
  try {
    convertThemeFromDir(
      resolve(__dirname, './vscodeThemes'),
      resolve(__dirname, '../public/themes')
    );
  } catch (error) {
    throw new Error(error);
  }
})()
