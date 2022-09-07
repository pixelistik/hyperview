// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type {
  Attributes,
  KeyboardAwareScrollViewProps,
  ScrollViewProps,
} from './types';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';
import { createStyleProp, createTestProps } from 'hyperview/src/services';
import { ATTRIBUTES } from './types';
import type { HvComponentProps } from 'hyperview/src/types';
import KeyboardAwareScrollView from 'hyperview/src/core/components/keyboard-aware-scroll-view';
import { LOCAL_NAME } from 'hyperview/src/types';
import { addHref } from 'hyperview/src/core/hyper-ref';

export default class HvView extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.VIEW;

  static localNameAliases = [
    LOCAL_NAME.BODY,
    LOCAL_NAME.FORM,
    LOCAL_NAME.HEADER,
    LOCAL_NAME.ITEM,
    LOCAL_NAME.ITEMS,
    LOCAL_NAME.SECTION_TITLE,
  ];

  props: HvComponentProps;

  attributes: Attributes;

  constructor(props: HvComponentProps) {
    super(props);
    this.updateAttributes();
  }

  componentDidUpdate(prevProps: HvComponentProps) {
    if (prevProps.element === this.props.element) {
      return;
    }

    this.updateAttributes();
  }

  updateAttributes = () => {
    // $FlowFixMe: reduce returns a mixed type, not Attributes
    this.attributes = Object.values(ATTRIBUTES).reduce(
      (attributes, name: string) => ({
        ...attributes,
        [name]: this.props.element.getAttribute(name),
      }),
      {},
    );
  };

  hasInputFields = (): boolean => {
    const textFields = this.props.element.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'text-field',
    );
    const textAreas = this.props.element.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'text-area',
    );
    return textFields.length > 0 || textAreas.length > 0;
  };

  getScrollViewProps = (children: Array<any>): ScrollViewProps => {
    const horizontal =
      this.attributes[ATTRIBUTES.SCROLL_ORIENTATION] === 'horizontal';
    const showScrollIndicator =
      this.attributes[ATTRIBUTES.SHOWS_SCROLL_INDICATOR] !== 'false';

    const contentContainerStyle = this.attributes[
      ATTRIBUTES.CONTENT_CONTAINER_STYLE
    ]
      ? createStyleProp(this.props.element, this.props.stylesheets, {
          ...this.props.options,
          styleAttr: ATTRIBUTES.CONTENT_CONTAINER_STYLE,
        })
      : undefined;

    // Fix scrollbar rendering issue in iOS 13+
    // https://github.com/facebook/react-native/issues/26610#issuecomment-539843444
    const scrollIndicatorInsets =
      Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 13
        ? { right: 1 }
        : undefined;

    // add sticky indicies
    const stickyHeaderIndices = children.reduce(
      (acc, element, index) =>
        typeof element !== 'string' &&
        element.props?.element?.getAttribute('sticky') === 'true'
          ? [...acc, index]
          : acc,
      [],
    );

    return {
      contentContainerStyle,
      horizontal,
      scrollIndicatorInsets,
      showsHorizontalScrollIndicator: horizontal && showScrollIndicator,
      showsVerticalScrollIndicator: !horizontal && showScrollIndicator,
      stickyHeaderIndices,
    };
  };

  getScrollToInputAdditionalOffsetProp = (): number => {
    const defaultOffset = 120;
    if (this.attributes[ATTRIBUTES.SCROLL_TO_INPUT_OFFSET]) {
      const offset = parseInt(
        this.attributes[ATTRIBUTES.SCROLL_TO_INPUT_OFFSET],
        10,
      );
      return Number.isNaN(offset) ? 0 : defaultOffset;
    }
    return defaultOffset;
  };

  getKeyboardAwareScrollViewProps = (
    inputFieldRefs: Array<any>,
  ): KeyboardAwareScrollViewProps => ({
    automaticallyAdjustContentInsets: false,
    getTextInputRefs: () => inputFieldRefs,
    keyboardShouldPersistTaps: 'handled',
    scrollEventThrottle: 16,
    scrollToInputAdditionalOffset: this.getScrollToInputAdditionalOffsetProp(),
  });

  Content = () => {
    let props: any = {
      ...createTestProps(this.props.element),
      style: createStyleProp(
        this.props.element,
        this.props.stylesheets,
        this.props.options,
      ),
    };

    let c = View;

    /**
     * Useful when you want keyboard avoiding behavior in non-scrollable views.
     * Note: Android has built-in support for avoiding keyboard.
     */
    const keyboardAvoiding =
      this.attributes[ATTRIBUTES.AVOID_KEYBOARD] === 'true' &&
      Platform.OS === 'ios';
    if (keyboardAvoiding) {
      c = KeyboardAvoidingView;
      props.behavior = 'position';
    }

    const hasInputFields = this.hasInputFields();
    const inputFieldRefs = [];
    const scrollable = this.attributes[ATTRIBUTES.SCROLL] === 'true';

    const safeArea = this.attributes[ATTRIBUTES.SAFE_AREA] === 'true';
    if (safeArea) {
      if (keyboardAvoiding || scrollable) {
        console.warn('safe-area is incompatible with scroll or avoid-keyboard');
      } else {
        c = SafeAreaView;
      }
    }

    const children = Render.renderChildren(
      this.props.element,
      this.props.stylesheets,
      this.props.onUpdate,
      {
        ...this.props.options,
        ...(scrollable && hasInputFields
          ? {
              registerInputHandler: ref => {
                if (ref !== null) {
                  inputFieldRefs.push(ref);
                }
              },
            }
          : {}),
      },
    );

    if (scrollable) {
      c = ScrollView;
      props = {
        ...props,
        ...this.getScrollViewProps(children),
      };
      if (hasInputFields) {
        c = KeyboardAwareScrollView;
        props = {
          ...props,
          ...this.getKeyboardAwareScrollViewProps(inputFieldRefs),
        };
      }
    }
    // $FlowFixMe
    return React.createElement(c, props, ...children);
  };

  render() {
    const { Content } = this;
    return this.props.options?.skipHref ? (
      <Content />
    ) : (
      addHref(
        <Content />,
        this.props.element,
        this.props.stylesheets,
        this.props.onUpdate,
        this.props.options,
      )
    );
  }
}
