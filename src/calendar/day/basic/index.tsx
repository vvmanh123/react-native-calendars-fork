import XDate from 'xdate';
import values from 'lodash/values';
import PropTypes from 'prop-types';
import React, { Fragment, useCallback, useRef } from 'react';
import { TouchableOpacity, Text, View, ViewProps, ViewStyle } from 'react-native';

import { xdateToData } from '../../../interface';
import { Theme, DayState, MarkingTypes, DateData } from '../../../types';
import styleConstructor from './style';
import Marking, { MarkingProps } from '../marking';


export interface BasicDayProps extends ViewProps {
  state?: DayState;
  /** The marking object */
  marking?: MarkingProps;
  /** Date marking style [simple/period/multi-dot/multi-period]. Default = 'simple' */
  markingType?: MarkingTypes;
  /** Theme object */
  theme?: Theme;
  /** onPress callback */
  onPress?: (date?: DateData) => void;
  /** onLongPress callback */
  onLongPress?: (date?: DateData) => void;
  /** The date to return from press callbacks */
  date?: any;

  /** Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates*/
  disableAllTouchEventsForDisabledDays?: boolean;
  /** Disable all touch events for inactive days. can be override with disableTouchEvent in markedDates*/
  disableAllTouchEventsForInactiveDays?: boolean;

  /** Test ID */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;

  children?: any,
  fromDate?: any,
  toDate?: any,
  txtStyle?: ViewStyle
}

const BasicDay = (props: BasicDayProps) => {
  const {
    theme,
    date,
    onPress,
    onLongPress,
    markingType,
    marking,
    state,
    disableAllTouchEventsForDisabledDays,
    disableAllTouchEventsForInactiveDays,
    accessibilityLabel,
    children,
    testID,
    fromDate,
    toDate,
    txtStyle
  } = props;
  const style = useRef(styleConstructor(theme));
  const _marking = marking || {};
  const isSelected = _marking.selected || state === 'selected';
  const isSelectedBetween = state === "inactive"
  const isDisabled = typeof _marking.disabled !== 'undefined' ? _marking.disabled : state === 'disabled' || state === "disableToday";
  const isInactive = _marking?.inactive;
  const isToday = state === 'today' || state === "disableToday";
  const isCustom = markingType === Marking.markings.CUSTOM;
  const dateData = date ? xdateToData(new XDate(date)) : undefined;

  const shouldDisableTouchEvent = () => {
    const { disableTouchEvent } = _marking;
    let disableTouch = false;

    if (typeof disableTouchEvent === 'boolean') {
      disableTouch = disableTouchEvent;
    } else if (typeof disableAllTouchEventsForDisabledDays === 'boolean' && isDisabled) {
      disableTouch = disableAllTouchEventsForDisabledDays;
    } else if (typeof disableAllTouchEventsForInactiveDays === 'boolean' && isInactive) {
      disableTouch = disableAllTouchEventsForInactiveDays;
    }
    return disableTouch;
  };

  const getContainerStyle = () => {
    const { customStyles, selectedColor } = _marking;
    const styles = [style.current.base];

    if (isSelected) {
      styles.push(style.current.selected);
      if (selectedColor) {
        styles.push({ backgroundColor: selectedColor });
      }
    } else if (isSelectedBetween) {
      styles.push(style.current.selectedBetween);
    } else if (isToday) {
      styles.push(style.current.today);
    }

    //Custom marking type
    if (isCustom && customStyles && customStyles.container) {
      if (customStyles.container.borderRadius === undefined) {
        customStyles.container.borderRadius = 16;
      }
      styles.push(customStyles.container);
    }

    return styles;
  };

  const getTextStyle = () => {
    const { customStyles, selectedTextColor } = _marking;
    const styles = [style.current.text, txtStyle && txtStyle];

    if (isSelected) {
      styles.push(style.current.selectedText);
      if (selectedTextColor) {
        styles.push({ color: selectedTextColor })
      }
    } else if (isDisabled) {
      styles.push(style.current.disabledText);
      txtStyle && styles.push(txtStyle);
    } else if (isToday) {
      styles.push(style.current.todayText);
    } else if (isInactive) {
      styles.push(style.current.inactiveText);
    }

    //Custom marking type
    if (isCustom && customStyles && customStyles.text) {
      styles.push(customStyles.text);
    }

    return styles;
  };

  const getfillersRightStyle = () => {
    if (fromDate && toDate) {
      const dateCurrent = new XDate(date, true).setHours(0)
      let fromDateSelect = new XDate(fromDate, true).setHours(0)
      let toDateSelect = new XDate(toDate, true).setHours(0)
      if (dateCurrent >= fromDateSelect && dateCurrent < toDateSelect) {
        return style.current.selectedBetween
      }
    }
    return null
  }

  const getfillersLeftStyle = () => {
    if (fromDate && toDate) {
      const dateCurrent = new XDate(date, true).setHours(0)
      let fromDateSelect = new XDate(fromDate, true).setHours(0)
      let toDateSelect = new XDate(toDate, true).setHours(0)
      if (dateCurrent > fromDateSelect && dateCurrent <= toDateSelect) {
        return style.current.selectedBetween
      }
    }
    return null
  }

  const getViewDisableStyle = () => {
    const styles = []
    if (isDisabled) {
      styles.push([style.current.lineTextDisable, txtStyle && { backgroundColor: "#FFFFFF" }]);
    }
    return styles;
  };

  const checkDisableBtn = () => {
    if (isDisabled) return true
    return false
  }

  const _onPress = useCallback(() => {
    onPress?.(dateData);
  }, [onPress, date]);

  const _onLongPress = useCallback(() => {
    onLongPress?.(dateData);
  }, [onLongPress, date]);

  const renderText = () => {
    return (
      <Text allowFontScaling={false} style={getTextStyle()}>
        {String(children)}
      </Text>
    );
  };

  const renderContent = () => {
    return (
      <Fragment>
        <View style={getViewDisableStyle()} />
        {renderText()}
        {/* {renderMarking()} */}
      </Fragment>
    );
  };

  const renderContainer = () => {
    const { activeOpacity } = _marking;
    return (
      <>
        <View style={style.current.conntainerFillter}>
          <View
            style={[style.current.fillter, getfillersLeftStyle()]}
          />
          <View
            style={[style.current.fillter, getfillersRightStyle()]}
          />
        </View>
        <TouchableOpacity
          testID={testID}
          style={getContainerStyle()}
          disabled={checkDisableBtn()}
          activeOpacity={activeOpacity}
          onPress={!checkDisableBtn() ? _onPress : undefined}
          onLongPress={!shouldDisableTouchEvent() ? _onLongPress : undefined}
          accessible
          accessibilityRole={isDisabled ? undefined : 'button'}
          accessibilityLabel={accessibilityLabel}
        >

          {renderContent()}
        </TouchableOpacity>
      </>
    );
  };

  const renderPeriodsContainer = () => {
    return (
      <View style={style.current.container}>
        {renderContainer()}
        {/* {renderMarking()} */}
      </View>
    );
  };

  return renderPeriodsContainer()
};

export default BasicDay;
BasicDay.displayName = 'BasicDay';
BasicDay.propTypes = {
  state: PropTypes.oneOf(['selected', 'disabled', 'inactive', 'today', '']),
  marking: PropTypes.any,
  markingType: PropTypes.oneOf(values(Marking.markings)),
  theme: PropTypes.object,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  date: PropTypes.string,
  disableAllTouchEventsForDisabledDays: PropTypes.bool,
  disableAllTouchEventsForInactiveDays: PropTypes.bool
};
