import { rest } from 'msw';
import { CODES_RESPONSE_RESULT_MAP } from '@/mocks/config';

const mockCodeApi = {
  getCodes: rest.get('*/code', (req, res, ctx) => {
    const page = req.url.searchParams.get('page');

    if (!page || (page !== '1' && page !== '2')) {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'can not find the codes page',
        }),
      );
    }
    return res(
      ctx.status(200),
      ctx.json({
        message: 'success',
        status: 'success',
        resultMap: CODES_RESPONSE_RESULT_MAP[page],
      }),
    );
  }),
  postCode: rest.post('*/code', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'save code success',
        status: 'success',
        resultMap: {
          code: { _id: 'post123' },
        },
      }),
    );
  }),
  putCode: rest.put('*/code/:codeId', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'update code success',
        status: 'success',
        resultMap: {
          code: { _id: req.params.codeId },
        },
      }),
    );
  }),
  deleteCode: rest.delete('*/code/:codeId', (req, res, ctx) => {
    if (req.params.codeId !== '6361d5461292968b0f28f39f') {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'failed to delete',
        }),
      );
    }
    return res(
      ctx.status(200),
      ctx.json({
        message: 'successfully deleted',
        status: 'success',
      }),
    );
  }),
};

export default mockCodeApi;
