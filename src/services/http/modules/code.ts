import type { CodePayload } from '@/types/code-content';
import type { CodeListResponse, CodeResponse } from '@/types/response';
import { del, get, post, put } from '../request';

export function getCodes(page: number) {
  return get<CodeListResponse>(`/code?page=${page}`);
}

export function getCode(codeId: string) {
  return get<CodeResponse>(`/code/${codeId}`);
}

export function postCode(data: CodePayload) {
  return post<CodeResponse>('/code', { codeContent: JSON.stringify(data) });
}

export function putCode(codeId: string, data: CodePayload) {
  return put<null>(`/code/${codeId}`, { codeContent: JSON.stringify(data) });
}

export function deleteCode(codeId: string) {
  return del<null>(`/code/${codeId}`);
}
