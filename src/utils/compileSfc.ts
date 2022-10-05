import { parse, compileScript, SFCDescriptor, SFCStyleBlock } from 'vue/compiler-sfc';
import { SCRIPT_TYPE_MAP } from '@/config/scriptType';
import { transformCss } from '@/utils/compile';
import { loadParse } from '@/utils/loadParse';
import type { CodeContent } from '@/types/codeContent';

export function compileSfc(content: CodeContent): Promise<CodeContent> {
  const { vue } = content;
  const sfcPromise = parseSfc(vue!);

  return new Promise((resolve, reject) => {
    sfcPromise.then(codeContent => {
      resolve(codeContent);
    })
    .catch(reject);
  })
}

function parseSfc(content: string): Promise<CodeContent> {
  return new Promise(async (resolve, reject) => {
    try {
      const { descriptor } = parse(content);

      if (descriptor.scriptSetup) {
        descriptor.script = compileScript(descriptor, {
          id: `${Math.random()}`.slice(-10) + Date.now(),
          // refSugar: true,
        });
      }
      resolve(await processDescriptor(descriptor));
    } catch (error) {
      reject(error);
    }
  });
}

async function processDescriptor(descriptor: SFCDescriptor): Promise<CodeContent> {
  const { script, styles } = descriptor;
  const scriptType = SCRIPT_TYPE_MAP.VueSFC ?? '';
  const { code } = self.Babel.transform(script?.content, {
    presets: ['env', 'react'],
  });

  console.log(descriptor)
  return {
    html: '<div id="app"></div>',
    css: await parseCss(styles),
    js: `<script ${scriptType}>${code}<\/script>`,
  }
}

async function parseCss(styles: SFCStyleBlock[]) {
  let result = '';

  for (const style of styles) {
    const { content, lang = 'css' } = style;
    await loadParse(lang).catch(error => { throw new Error(error) });
    const css = await transformCss(content, lang);
    result += `${css}\r\n`;
  }
  return result;
}