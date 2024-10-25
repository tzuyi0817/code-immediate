import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SUFFIX_MAP } from '@/config/suffix';
import type { CodeMap } from '@/types/code-content';

type ExportData = Omit<CodeMap, 'resources'>;

export async function exportZip({ content, language }: ExportData, filename: string) {
  const zip = new JSZip();
  const suffix = SUFFIX_MAP[language];

  zip.file(`index.${suffix}`, content);
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${filename || 'download'}.zip`, { autoBom: true });
}
