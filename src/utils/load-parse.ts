import loadjs from 'loadjs';
import { CSS_LANGUAGE_MAP, HTML_LANGUAGE_MAP, JS_LANGUAGE_MAP } from '@/constants/language';
import { useFlagStore } from '@/store';
import type { CodeTemplateMap } from '@/types/code-content';

export const loadedParseMap = new Map([
  ['html', true],
  ['css', true],
  ['javascript', true],
]);

export async function loadParse(language: string): Promise<void> {
  if (loadedParseMap.get(language)) return;

  await loadjs(`parses/${language}.js`, { returnPromise: true });
  loadedParseMap.set(language, true);
}

export async function loadParseSource(language: string, languageMap: Record<string, string>) {
  const { setLoading } = useFlagStore();
  const source = languageMap[language];

  setLoading({ isOpen: true, type: 'Loading parse source' });

  if (source) {
    try {
      await loadParse(source);
    } catch (error) {
      setLoading({ isOpen: false, type: 'Loading parse source error' });
      throw error;
    }
  }
  setLoading({ isOpen: false, type: 'Loading parse source finished' });
}

export function loadParseSources({ HTML, CSS, JS }: Pick<CodeTemplateMap, 'HTML' | 'CSS' | 'JS'>) {
  return Promise.all([
    loadParseSource(HTML.language, HTML_LANGUAGE_MAP),
    loadParseSource(CSS.language, CSS_LANGUAGE_MAP),
    loadParseSource(JS.language, JS_LANGUAGE_MAP),
  ]);
}
