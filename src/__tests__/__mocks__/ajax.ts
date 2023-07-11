import ajax from '@/utils/ajax';

function spyAjax(method: 'get' | 'post' | 'put' | 'delete') {
  return jest.spyOn(ajax, method);
}

export default spyAjax;
