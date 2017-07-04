// @flow

import React, {PropTypes, PureComponent} from 'react';
import {
  requireNativeComponent,
  Text,
  View,
  NativeMethodsMixin,
  Touchable,
  processColor
} from 'react-native';

type TLinkTextProps = {
  text: string,
  url: string,
} & Text.propTypes & View.propTypes;

type TRectOffset = {
  top: number,
  left: number,
  right: number,
  bottom: number,
};

const PRESS_RECT_OFFSET = {top: 20, left: 20, right: 20, bottom: 30};

class LinkText extends PureComponent {
  static defaultProps = {
    accessible: true,
    allowFontScaling: true,
    ellipsizeMode: 'tail',
    url: '',
    text: '',
  };

  mixins = NativeMethodsMixin;
  props: TLinkTextProps;
  state = {
    isHighlighted: false,
    ...Touchable.Mixin.touchableGetInitialState(),
  };

  getChildContext(): Object {
    return {isInAParentText: true};
  }

  render() {
    let newProps = this.props;
    if (this.props.onStartShouldSetResponder || this._hasPressHandler()) {
      if (!this._handlers) {
        this.setupHandlers();
      }

      newProps = {
        ...this.props,
        ...this._handlers,
        isHighlighted: this.state.isHighlighted,
      };
    }

    if (newProps.selectionColor != null) {
      newProps = {
        ...newProps,
        selectionColor: processColor(newProps.selectionColor)
      };
    }
    if (Touchable.TOUCH_TARGET_DEBUG && newProps.onPress) {
      newProps = {
        ...newProps,
        style: [this.props.style, {color: 'magenta'}],
      };
    }

    if (this.context.isInAParentText) {
      return <ReactVirtualLinkTextView {...newProps} />;
    }
    return <ReactLinkTextView {...newProps} />;
  }

  setupHandlers = () => {
    this._handlers = {
      onStartShouldSetResponder: (): boolean => {
        const shouldSetFromProps = this.props.onStartShouldSetResponder &&
            this.props.onStartShouldSetResponder();
        const setResponder = shouldSetFromProps || this._hasPressHandler();
        if (setResponder && !this.touchableHandleActivePressIn) {
          // Attach and bind all the other handlers only the first time a touch
          // actually happens.
          for (const key in Touchable.Mixin) {
            if (typeof Touchable.Mixin[key] === 'function') {
              (this: any)[key] = Touchable.Mixin[key].bind(this);
            }
          }
          this.touchableHandleActivePressIn = () => {
            if (this.props.suppressHighlighting || !this._hasPressHandler()) {
              return;
            }
            this.setState({
              isHighlighted: true,
            });
          };

          this.touchableHandleActivePressOut = () => {
            if (this.props.suppressHighlighting || !this._hasPressHandler()) {
              return;
            }
            this.setState({
              isHighlighted: false,
            });
          };

          this.touchableHandlePress = (e: SyntheticEvent) => {
            if (this.props.onPress) this.props.onPress(e);
          };

          this.touchableHandleLongPress = (e: SyntheticEvent) => {
            if (this.props.onLongPress) this.props.onLongPress(e);
          };

          this.touchableGetPressRectOffset = (): TRectOffset => (
            this.props.pressRetentionOffset || PRESS_RECT_OFFSET
          );
        }
        return setResponder;
      },
      onResponderGrant: (e: SyntheticEvent, dispatchID: string) => {
        this.touchableHandleResponderGrant(e, dispatchID);
        if (this.props.onResponderGrant) {
          this.props.onResponderGrant.apply(this, arguments);
        }
      },
      onResponderMove: (e: SyntheticEvent) => {
        this.touchableHandleResponderMove(e);
        if (this.props.onResponderMove) {
          this.props.onResponderMove.apply(this, arguments);
        }
      },
      onResponderRelease: (e: SyntheticEvent) => {
        this.touchableHandleResponderRelease(e);
        if (this.props.onResponderRelease) {
          this.props.onResponderRelease.apply(this, arguments);
        }
      },
      onResponderTerminate: (e: SyntheticEvent) => {
        this.touchableHandleResponderTerminate(e);
        if (this.props.onResponderTerminate) {
          this.props.onResponderTerminate.apply(this, arguments);
        }
      },
      onResponderTerminationRequest: (): boolean => {
        // Allow touchable or props.onResponderTerminationRequest to deny
        // the request
        let allowTermination = this.touchableHandleResponderTerminationRequest();
        if (allowTermination && this.props.onResponderTerminationRequest) {
          allowTermination = this.props.onResponderTerminationRequest.apply(this, arguments);
        }
        return allowTermination;
      },
    };
  }

  /**
   * Only assigned if touch is needed.
   */
  _handlers = (null: ?Object);
  _hasPressHandler = (): boolean => (!!this.props.onPress || !!this.props.onLongPress);
  /**
   * These are assigned lazily the first time the responder is set to make plain
   * text nodes as cheap as possible.
   */
  touchableHandleActivePressIn = (null: ?Function);
  touchableHandleActivePressOut = (null: ?Function);
  touchableHandlePress = (null: ?Function);
  touchableHandleLongPress = (null: ?Function);
  touchableGetPressRectOffset = (null: ?Function);
}

LinkText.propTypes = {
  ...View.propTypes,
  ...Text.propTypes,
  url: PropTypes.string,
  text: PropTypes.string,
};
LinkText.childContextTypes = {
  isInAParentText: PropTypes.bool
};
LinkText.contextTypes = {
  isInAParentText: PropTypes.bool
};

const ReactLinkTextView = requireNativeComponent('ReactLinkTextView', LinkText);
const ReactVirtualLinkTextView = requireNativeComponent('ReactVirtualLinkTextView', LinkText);
export default LinkText;
