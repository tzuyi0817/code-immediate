// import 'monaco-editor/esm/vs/basic-languages/html/html.contribution';
// import 'monaco-editor/esm/vs/basic-languages/css/css.contribution';
// import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import { wireTmGrammars } from 'monaco-editor-textmate';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { debounce } from '@/utils/common';
import { registry, GRAMMARS_MAP } from '@/utils/monacoEditor';
import { useCodeContentStore } from '@/store';

const LANGUAGE_MAP = {
  html: 'HTML',
  css: 'CSS',
  javascript: 'JS',
} as const;

export default function useMonacoEditor() {
  const { setCodeContent } = useCodeContentStore();
  const monacoEditor = {
    editor: null as monaco.editor.IStandaloneCodeEditor | null,
  };

  function createEditor(DOM: HTMLElement, language: string) {
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
      // readOnly: false
    });

    monacoEditor.editor.onDidChangeModelContent(debounce(() => {
      const code = monacoEditor.editor?.getValue()!;
      const type = LANGUAGE_MAP[language as keyof typeof LANGUAGE_MAP];
      setCodeContent({ type, code });
    }));

    monacoEditor.editor.onDidBlurEditorText(debounce(() => {
      console.log('onDidBlurEditorText');
    }));

    console.log(monacoEditor);
  }

  async function updateEditorModel(code: string, language: string) {
    const model = monaco.editor.createModel(code, language);
    const oldModel = monacoEditor.editor?.getModel();
    const grammars = new Map([[language, GRAMMARS_MAP.get(language)!]]);

    monacoEditor.editor?.setModel(model);
    oldModel?.dispose();
    setModelMarkers(model);
    await wireTmGrammars(monaco, registry(`${language}.tmLanguage`), grammars, monacoEditor.editor!);
  }

  function setModelMarkers(model: monaco.editor.ITextModel) {
    // editor.setModelMarkers(model, 'json', [{
    //   startLineNumber: 2,
    //   endLineNumber: 2,
    //   startColumn: 1,
    //   endColumn: 10,
    //   severity: MarkerSeverity.Error,
    //   message: `语法错误`,
    // }]);
  }

  return {
    monacoEditor,
    createEditor,
    updateEditorModel,
  }
}