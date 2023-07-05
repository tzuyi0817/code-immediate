import ajax from '@/utils/ajax';
import { useCodeContentStore, useFlagStore } from '@/store';
import { loadParseSources } from '@/utils/loadParse';
import type { CodeProject } from '@/types/codeContent';

type CodePayload = Omit<CodeProject, 'id' | 'srcdoc'>

export function getCodes(page: number) {
  return ajax.get(`/code?page=${page}`);
}

export async function getCode(codeId: string) {
  if (!codeId) return;
  const { setCodeLoading } = useFlagStore();
  setCodeLoading(true);
  const { resultMap } = await ajax.get(`/code/${codeId}`).catch(() => setCodeLoading(false));

  if (resultMap) {
    const { setCodeMap, setCodeTemplate, setCodeTitle } = useCodeContentStore();
    const { title, HTML, CSS, JS, VUE, codeTemplate } = resultMap.code;

    await loadParseSources({ HTML, CSS, JS });
    setCodeMap({ HTML, CSS, JS, VUE });
    setCodeTemplate(codeTemplate);
    setCodeTitle(title);
  }
  setCodeLoading(false);
}

export function postCode(data: CodePayload) {
  return ajax.post('/code', { codeContent: JSON.stringify(data) });
}

export function putCode(codeId: string, data: CodePayload) {
  return ajax.put(`/code/${codeId}`, { codeContent: JSON.stringify(data) });
}

export function deleteCode(codeId: string) {
  return ajax.delete(`/code/${codeId}`);
}
