export interface CdnItem {
  description: string;
  fileType: string;
  filename: string;
  latest: string;
  name: string;
  objectID: string;
  version: string;
}

export type CdnModel = 'CSS' | 'JS';

export interface CdnSourceMap {
  variables: { local: string; imported: string }[];
  module: string;
}

export interface CdnJsResponse {
  available: number;
  results: CdnItem[];
  total: number;
}
