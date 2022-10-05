import { wireTmGrammars } from 'monaco-editor-textmate';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { debounce, sleep } from '@/utils/common';
import { registry, GRAMMARS_MAP, COMMON_GRAMMARS_MAP } from '@/utils/monacoEditor';
import { useCodeContentStore } from '@/store';
import type { CodeModel } from '@/types/codeContent';

export default function useMonacoEditor() {
  const { setCodeContent } = useCodeContentStore();
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

    monacoEditor.editor.onDidChangeModelContent(debounce(() => {
      const code = monacoEditor.editor?.getValue()!;
      const type = model;
      setCodeContent({ type, code });
    }, 1500));

    monacoEditor.editor.onDidBlurEditorText(debounce(() => {
      console.log('onDidBlurEditorText');
    }));
  }

  async function updateEditorModel(code: string, language: string) {
    language = language.toLowerCase();
    const languageType = COMMON_GRAMMARS_MAP[language as keyof typeof COMMON_GRAMMARS_MAP] ?? language;
    const model = monaco.editor.createModel(code, languageType);
    const oldModel = monacoEditor.editor?.getModel();
    const grammars = new Map([[languageType, GRAMMARS_MAP.get(languageType)!]]);

    monacoEditor.editor?.setModel(model);
    oldModel?.dispose();
    setModelMarkers(model);
    await sleep();
    await wireTmGrammars(monaco, registry(), grammars, monacoEditor.editor!);
  }

  function setModelMarkers(model: monaco.editor.ITextModel) {
    // monaco.editor.setModelMarkers(model, 'owner', [{
    //   startLineNumber: 2,
    //   endLineNumber: 2,
    //   startColumn: 1,
    //   endColumn: 10,
    //   severity: monaco.MarkerSeverity.Error,
    //   message: `syntax error`,
    // }]);
  }

  return {
    monacoEditor,
    createEditor,
    updateEditorModel,
  }
}