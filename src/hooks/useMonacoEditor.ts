import 'monaco-editor/esm/vs/basic-languages/html/html.contribution';
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution';
// import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import { editor, MarkerSeverity } from 'monaco-editor/esm/vs/editor/editor.api';
import { debounce } from '@/utils/common';
import { useCodeContentStore } from '@/store';

enum LanguageMap {
  html = 'HTML',
  css = 'CSS',
  javascript = 'JS',
};

export default function useMonacoEditor() {
  const { setCodeContent } = useCodeContentStore();
  const monacoEditor = {
    editor: null as editor.IStandaloneCodeEditor | null,
  };

  function createEditor(DOM: HTMLElement, language: string) {
    monacoEditor.editor = editor.create(DOM, {
      model: null,
      minimap: {
        enabled: false,
      },
      wordWrap: 'on',
      theme: 'vs-dark',
      fontSize: 14,
      fontFamily: 'MonoLisa, monospace',
      contextmenu: false,
      fixedOverflowWidgets: true,
      lineNumbers: 'off',
      // readOnly: false
    });

    monacoEditor.editor.onDidChangeModelContent(debounce(() => {
      const code = monacoEditor.editor?.getValue()!;
      const type = LanguageMap[language as keyof typeof LanguageMap];
      console.log('onDidChangeModelContent', { code });
      setCodeContent({ type, code });
    }));

    monacoEditor.editor.onDidBlurEditorText(debounce(() => {
      console.log('onDidBlurEditorText');
    }));

    console.log(monacoEditor);
  }

  function updateEditorModel(code: string, language: string) {
    const model = editor.createModel(code, language);
    const oldModel = monacoEditor.editor?.getModel();

    monacoEditor.editor?.setModel(model);
    oldModel?.dispose();
    setModelMarkers(model);
  }

  function setModelMarkers(model: editor.ITextModel) {
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