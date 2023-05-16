/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { HvBehavior, HvComponent } from 'hyperview/src/types';
import { Navigation, Route } from '@react-navigation/native';
import type { Props as ErrorProps } from 'hyperview/src/core/components/load-error/types';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading/types';
import React from 'react';

/**
 * Props used by navigation components
 */
export type NavigationProps = {
  navigation?: Navigation;
  route?: Route;
};

/**
 * Props used for data fetching
 */
export type DataProps = {
  entrypointUrl: string;
  fetch: (input: string, init: object) => string;
  formatDate?: (date: string, format: string) => string;
  onParseAfter?: (url: string) => void;
  onParseBefore?: (url: string) => void;
};

/**
 * Props used by legacy external navigation components
 */
export type ActionProps = {
  back?: () => void;
  closeModal?: () => void;
  navigate?: (params: object, key: string) => void;
  openModal?: (params: object) => void;
  push?: (params: object) => void;
};

/**
 * Props used just by hv-screen
 */
export type ComponentProps = {
  behaviors?: HvBehavior[];
  components?: HvComponent[];
  elementErrorComponent?: React.ComponentType<ErrorProps>;
  errorScreen?: React.ComponentType<ErrorProps>;
  loadingScreen?: React.ComponentType<LoadingProps>;
  refreshControl?: React.ComponentType;
};

/**
 * All of the props used by hv-screen
 */
export type Props = NavigationProps & DataProps & ActionProps & HvScreenProps;