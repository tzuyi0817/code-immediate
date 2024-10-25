import loadjs from 'loadjs';
import { useFlagStore } from '@/store';
import { HTML_LANGUAGE_MAP, CSS_LANGUAGE_MAP, JS_LANGUAGE_MAP } from '@/config/language';
import type { CodeBase } from '@/types/code-content';

export const loadedParseMap = new Map([
  ['html', true],
  ['css', true],
  ['javascript', true],
]);

export function loadParse(language: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (loadedParseMap.get(language)) return resolve();
    const resource = `parses/${language}.js`;

    loadjs(resource, { returnPromise: true })
      .then(() => {
        loadedParseMap.set(language, true);
        resolve();
      })
      .catch((error: Error) => reject(error));
  });
}

export async function loadParseSource(language: string, languageMap: Record<string, string>) {
  const { setLoading } = useFlagStore();
  const source = languageMap[language];

  setLoading({ isOpen: true, type: 'Loading parse source' });

  if (source) {
    await loadParse(source).catch(error => {
      setLoading({ isOpen: false, type: 'Loading parse source error' });
      throw error;
    });
  }
  setLoading({ isOpen: false, type: 'Loading parse source finished' });
}

export function loadParseSources({ HTML, CSS, JS }: CodeBase) {
  return Promise.all([
    loadParseSource(HTML.language, HTML_LANGUAGE_MAP),
    loadParseSource(CSS.language, CSS_LANGUAGE_MAP),
    loadParseSource(JS.language, JS_LANGUAGE_MAP),
  ]);
}
