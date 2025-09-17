import { URI } from 'vscode-uri';

export function asFileName(uri: URI) {
  return uri.path;
}

export function asUri(fileName: string) {
  return URI.file(fileName);
}

export function getCdnPath(uri: URI) {
  if (uri.scheme !== 'file') return;
  if (uri.path === '/node_modules') return '';
  if (uri.path.startsWith('/node_modules/')) {
    return uri.path.slice('/node_modules/'.length);
  }
}
