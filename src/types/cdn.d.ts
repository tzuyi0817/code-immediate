export interface CdnItem {
  description: string;
  fileType: string;
  filename: string;
  latest: string;
  name: string;
  objectID: string;
  version: string;
  _highlightResult?: {};
};

export type CdnModel = 'CSS' | 'JS';

export interface CdnSourceMap {
  variables: { local: string, imported: string }[];
  module: string;
}