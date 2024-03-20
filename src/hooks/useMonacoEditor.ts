import { wireTmGrammars } from 'monaco-editor-textmate';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { debounce, sleep } from '@/utils/common';
import { registry } from '@/utils/monacoEditor';
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
      theme: 'vs-code-theme-converted',
      fontSize: 14,
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
        const code = monacoEditor.editor?.getValue()!;
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
    const theme = (editor as any)._themeService._theme;

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
          return { foreground: _readonly ? 21 : 9 };
        default:
          return { foreground: 0 };
      }
    };
  }

  async function updateEditorModel(code: string, language: string) {
    language = language.toLowerCase();
    const uri = monaco.Uri.parse(`file:///demo.${language}`);
    const oldModel = monacoEditor.editor?.getModel();

    if (oldModel?.uri.path === uri.path) {
      oldModel.setValue(code);
      return;
    }
    const languageType = COMMON_GRAMMARS_MAP[language as keyof typeof COMMON_GRAMMARS_MAP] ?? language;
    const model = monaco.editor.createModel(code, languageType, uri);
    const grammars = new Map([[languageType, GRAMMARS_MAP.get(languageType)!]]);

    monacoEditor.editor?.setModel(model);
    oldModel?.dispose();
    if (import.meta.env.MODE === 'test') return;
    await sleep();
    await wireTmGrammars(monaco, registry(), grammars, monacoEditor.editor!);
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
