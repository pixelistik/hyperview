/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const HTTP_HEADERS = {
  ACCEPT: 'Accept',
  CONTENT_TYPE: 'Content-Type',
  X_HYPERVIEW_DIMENSIONS: 'X-Hyperview-Dimensions',
  X_HYPERVIEW_VERSION: 'X-Hyperview-Version',
} as const;

export const HTTP_METHODS = {
  GET: 'get',
  POST: 'post',
} as const;

export type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];

export const CONTENT_TYPE = {
  APPLICATION_XML: 'application/xml',
  TEXT_HTML: 'text/html',
} as const;

export type Fetch = (
  url: string,
  options: {
    headers: {
      [key: string]: any
    }
  },
) => Promise<Response>;

export type ErrorHandler = (error: Error) => void;

export type BeforeAfterParseHandler = (url: string) => void;