import { rest } from 'msw';

const mockLocalFile = [
  rest.get('*/grammars/html.tmLanguage.json', async (_, res, ctx) => {
    const jsonFile = await import('public/grammars/html.tmLanguage.json');

    return res(ctx.json(jsonFile));
  }),
  rest.get('*/grammars/css.tmLanguage.json', async (_, res, ctx) => {
    const jsonFile = await import('public/grammars/css.tmLanguage.json');

    return res(ctx.json(jsonFile));
  }),
  rest.get('*/grammars/javascript.tmLanguage.json', async (_, res, ctx) => {
    const jsonFile = await import('public/grammars/javascript.tmLanguage.json');

    return res(ctx.json(jsonFile));
  }),
];

export default mockLocalFile;
