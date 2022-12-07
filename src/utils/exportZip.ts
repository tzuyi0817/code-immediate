import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SUFFIX_MAP } from '@/config/suffix';
import type { CodeMap } from '@/types/codeContent';

type ExportData = Omit<CodeMap, 'resources'>;

async function exportZip({ content, language }: ExportData, filename: string) {
  const zip = new JSZip();
  const suffix = SUFFIX_MAP[language as keyof typeof SUFFIX_MAP];

  zip.file(`index.${suffix}`, content);
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${filename || 'download'}.zip`, { autoBom: true});
}

export default exportZip;
