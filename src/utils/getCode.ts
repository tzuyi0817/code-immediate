import ajax from '@/utils/ajax';
import { useCodeContentStore, useFlagStore } from '@/store';
import { loadParseSources } from '@/utils/loadParse';

export default async function getCode(codeId: string) {
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
