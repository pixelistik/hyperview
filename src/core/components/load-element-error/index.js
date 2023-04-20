// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import type { Props } from './types';
import React from 'react';
import styles from './styles';

const LoadElementError = (props: Props) => {
  const getError = () => {
    if (__DEV__) {
      return `${props.error.name}: ${props.error.message}`;
    }
    if (
      props.error.name === 'TypeError' &&
      props.error.message === 'Network request failed'
    ) {
      return 'You seem to be offline, check your connection';
    }
    return 'An error occured';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{getError()}</Text>
        <TouchableOpacity onPress={props.onPressReload}>
          <Text style={styles.button}>Reload</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoadElementError;