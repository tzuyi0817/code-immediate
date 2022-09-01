import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { debounce } from '@/utils/common';
import { useCodeContentStore } from '@/store';

export default function useMonacoEditor() {
  const { setCodeContent } = useCodeContentStore();
  const monacoEditor = {
    editor: null as editor.IStandaloneCodeEditor | null,
  };

  function createEditor(DOM: HTMLElement) {
    monacoEditor.editor = editor.create(DOM, {
      model: null,
      minimap: {
        enabled: false,
      },
      wordWrap: 'on',
      theme: 'vs-dark',
      // fontSize: 16,
      fontFamily: 'MonoLisa, monospace',
      contextmenu: false,
      fixedOverflowWidgets: true,
      // readOnly: false
    });

    monacoEditor.editor.onDidChangeModelContent(debounce(() => {
      const code = monacoEditor.editor?.getValue()!;
      console.log('onDidChangeModelContent', { code });
      setCodeContent({ type: 'HTML', code });
    }));

    monacoEditor.editor.onDidBlurEditorText(debounce(() => {
      console.log('onDidBlurEditorText');
    }));

    console.log(monacoEditor);
  }

  function updateEditorModel(code: string, language: string) {
    // const oldModel = 
    const model = editor.createModel(code, language);

    monacoEditor.editor?.setModel(model);
  }

  return {
    monacoEditor,
    createEditor,
    updateEditorModel,
  }
}