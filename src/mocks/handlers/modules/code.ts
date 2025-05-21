import { http, HttpResponse } from 'msw';
import { CODES_RESPONSE_RESULT_MAP } from '@/mocks/config';

export const mockCodeApi = {
  getCodes: http.get('*/code', ({ request }) => {
    const page = new URL(request.url).searchParams.get('page');

    if (!page || (page !== '1' && page !== '2')) {
      return HttpResponse.json({ message: 'can not find the codes page' }, { status: 400 });
    }

    return HttpResponse.json({
      message: 'success',
      status: 'success',
      resultMap: CODES_RESPONSE_RESULT_MAP[page],
    });
  }),
  postCode: http.post('*/code', () => {
    return HttpResponse.json({
      message: 'save code success',
      status: 'success',
      resultMap: {
        code: { _id: 'post123' },
      },
    });
  }),
  putCode: http.put('*/code/:codeId', ({ params }) => {
    return HttpResponse.json({
      message: 'update code success',
      status: 'success',
      resultMap: {
        code: { _id: params.codeId },
      },
    });
  }),
  deleteCode: http.delete('*/code/:codeId', ({ params }) => {
    const page1 = CODES_RESPONSE_RESULT_MAP[1];
    const page2 = CODES_RESPONSE_RESULT_MAP[2];

    page1.codeList = page1.codeList.filter(item => item.id !== params.codeId);
    page1.totalSize -= 1;

    page2.codeList = page2.codeList.filter(item => item.id !== params.codeId);
    page2.totalSize -= 1;

    return HttpResponse.json({
      message: 'successfully deleted',
      status: 'success',
    });
  }),
};
