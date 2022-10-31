import ajax from '@/utils/ajax';
import { useCodeContentStore, useFlagStore } from '@/store';

export default async function getCode(codeId: string) {
  if (!codeId) return;
  const { setCodeLoading } = useFlagStore();
  setCodeLoading(true);
  const { resultMap } = await ajax.get(`/code/${codeId}`).catch(() => setCodeLoading(false));
  setCodeLoading(false);

  if (!resultMap) return;
  const { setCodeMap, setCodeTemplate, setImportMap, setCodeTitle } = useCodeContentStore();
  const { title, HTML, CSS, JS, VUE, codeTemplate, importMap } = resultMap.code;

  setCodeMap({ HTML, CSS, JS, VUE });
  setCodeTemplate(codeTemplate);
  setImportMap(importMap);
  setCodeTitle(title);
}
