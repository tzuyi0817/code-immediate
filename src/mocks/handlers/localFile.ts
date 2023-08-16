import { rest } from 'msw';
import { fileURLToPath, URL } from 'node:url';

const mockLocalFile = [
  rest.get('*/grammars/html.tmLanguage.json', async (_, res, ctx) => {
    const jsonFile = await import(fileURLToPath(new URL('public/grammars/html.tmLanguage.json', import.meta.url)));

    return res(ctx.json(jsonFile));
  }),
  rest.get('*/grammars/css.tmLanguage.json', async (_, res, ctx) => {
    const jsonFile = await import(fileURLToPath(new URL('public/grammars/css.tmLanguage.json', import.meta.url)));

    return res(ctx.json(jsonFile));
  }),
  rest.get('*/grammars/javascript.tmLanguage.json', async (_, res, ctx) => {
    const jsonFile = await import(fileURLToPath(new URL('public/grammars/javascript.tmLanguage.json', import.meta.url)));

    return res(ctx.json(jsonFile));
  }),
];

export default mockLocalFile;
