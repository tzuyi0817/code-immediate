import { wireTmGrammars } from 'monaco-editor-textmate';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import themeDark from 'shiki/themes/dark-plus.mjs';
import { debounce, sleep } from '@/utils/common';
import { registry } from '@/monaco';
import { GRAMMARS_MAP, COMMON_GRAMMARS_MAP } from '@/config/grammar';
import { useCodeContentStore, useFlagStore } from '@/store';
import type { CodeModel } from '@/types/codeContent';

export default function useMonacoEditor() {
  const { setCodeContent } = useCodeContentStore();
  const { setChangeCodeFlag } = useFlagStore();
  const monacoEditor = {
    editor: null as monaco.editor.IStandaloneCodeEditor | null,
  };

  function createEditor(DOM: HTMLElement, model: CodeModel) {
    monacoEditor.editor = monaco.editor.create(DOM, {
      model: null,
      minimap: {
        enabled: false,
      },
      wordWrap: 'on',
      theme: themeDark.name,
      fontSize: 13,
      fontFamily: 'MonoLisa, monospace',
      contextmenu: false,
      fixedOverflowWidgets: true,
      lineNumbers: 'off',
      tabSize: 2,
      lineDecorationsWidth: 0,
    });

    highlightSemantic(monacoEditor.editor);
    monacoEditor.editor.onDidChangeModelContent(
      debounce(() => {
        if (!monacoEditor.editor) return;
        const code = monacoEditor.editor.getValue()!;
        const type = model;

        setCodeContent({ type, code });
        setChangeCodeFlag(true);
      }, 1500),
    );

    monacoEditor.editor.onDidBlurEditorText(
      debounce(() => {
        console.log('onDidBlurEditorText');
      }),
    );
  }

  function highlightSemantic(editor: monaco.editor.IStandaloneCodeEditor) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const theme = (editor as any)._themeService._theme;

    theme.semanticHighlighting = true;
    theme.getTokenStyleMetadata = (type: string, modifiers: string[]) => {
      const _readonly = modifiers.includes('readonly');
      switch (type) {
        case 'function':
        case 'method':
          return { foreground: 12 };
        case 'class':
          return { foreground: 11 };
        case 'variable':
        case 'property':
          return { foreground: _readonly ? 19 : 9 };
        default:
          return { foreground: 0 };
      }
    };
  }

  async function updateEditorModel(code: string, language: string) {
    if (!monacoEditor.editor) return;
    language = language.toLowerCase();

    const uri = monaco.Uri.parse(`file:///demo.${language}`);
    const oldModel = monacoEditor.editor.getModel();
    const cacheModel = monaco.editor.getModel(uri);
    const languageType = COMMON_GRAMMARS_MAP[language as keyof typeof COMMON_GRAMMARS_MAP] ?? language;
    const model = cacheModel ?? monaco.editor.createModel(code, languageType, uri);
    const grammars = new Map([[languageType, GRAMMARS_MAP.get(languageType)!]]);

    if (cacheModel) model.setValue(code);
    monacoEditor.editor.setModel(model);
    if (oldModel !== cacheModel) oldModel?.dispose();
    if (import.meta.env.MODE === 'test' || language === 'vue') return;
    await sleep();
    await wireTmGrammars(monaco, registry(), grammars, monacoEditor.editor);
  }

  function updateEditorValue(code: string) {
    monacoEditor.editor?.getModel()?.setValue(code);
  }

  return {
    monacoEditor,
    createEditor,
    updateEditorModel,
    updateEditorValue,
  };
}
