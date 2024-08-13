import { fileURLToPath, URL } from 'node:url';
import { http, HttpResponse } from 'msw';

export const mockLocalFiles = [
  http.get('*/grammars/html.tmLanguage.json', async () => {
    const jsonFile = await import(fileURLToPath(new URL('public/grammars/html.tmLanguage.json', import.meta.url)));

    return HttpResponse.json(jsonFile);
  }),
  http.get('*/grammars/css.tmLanguage.json', async () => {
    const jsonFile = await import(fileURLToPath(new URL('public/grammars/css.tmLanguage.json', import.meta.url)));

    return HttpResponse.json(jsonFile);
  }),
  http.get('*/grammars/javascript.tmLanguage.json', async () => {
    const jsonFile = await import(
      fileURLToPath(new URL('public/grammars/javascript.tmLanguage.json', import.meta.url))
    );

    return HttpResponse.json(jsonFile);
  }),
];
