import { get, post, put, del } from '@/utils/ajax';
import { useCodeContentStore, useFlagStore } from '@/store';
import { loadParseSources } from '@/utils/load-parse';
import { setupTemplate } from '@/config/template';
import type { CodePayload } from '@/types/code-content';
import type { CodeResponse, CodeListResponse } from '@/types/response';

export function getCodes(page: number) {
  return get<CodeListResponse>(`/code?page=${page}`);
}

export async function getCode(codeId: string) {
  if (!codeId) return;
  const { setCodeLoading } = useFlagStore();
  setCodeLoading(true);
  const { resultMap } = await get<CodeResponse>(`/code/${codeId}`).catch(() => {
    setCodeLoading(false);
    return { resultMap: null };
  });

  if (resultMap) {
    const { setCodeMap, setCodeTemplate, setCodeTitle } = useCodeContentStore();
    const { title, HTML, CSS, JS, VUE, codeTemplate } = resultMap.code;

    await loadParseSources({ HTML, CSS, JS });
    setCodeMap({ HTML, CSS, JS, VUE });
    setCodeTemplate(codeTemplate);
    setCodeTitle(title);
    setupTemplate();
  }
  setCodeLoading(false);
}

export function postCode(data: CodePayload) {
  return post<CodeResponse>('/code', { codeContent: JSON.stringify(data) });
}

export function putCode(codeId: string, data: CodePayload) {
  return put<null>(`/code/${codeId}`, { codeContent: JSON.stringify(data) });
}

export function deleteCode(codeId: string) {
  return del<null>(`/code/${codeId}`);
}
