import { rest, type MockedRequest } from 'msw';
import type { CodePayload } from '@/types/codeContent';

const mockCodeApi = {
  postCode: rest.post(/(http|https):\/\/.*\/code/, (_req, res, ctx) => {
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
};

export default mockCodeApi;
