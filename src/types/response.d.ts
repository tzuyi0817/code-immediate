import type { CodeProject, CodeTemplate, CodeTemplateMap } from './code-content';

export interface UserResponse {
  token: string;
  user: User;
}

interface CodeProjectFromCodeId extends CodeTemplateMap {
  title: string;
  codeTemplate: CodeTemplate;
  userId: string;
  _id: string;
}

export type CodeResponse = Record<'code', CodeProjectFromCodeId>;

export interface CodeListResponse {
  codeList: CodeProject[];
  page: string;
  totalPage: number;
  totalSize: number;
}
