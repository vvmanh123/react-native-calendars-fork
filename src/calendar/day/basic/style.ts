import { StyleSheet, Platform } from 'react-native';
import * as defaultStyle from '../../../style';
import { Theme } from '../../../types';
import constants from '../../../commons/constants';

export default function styleConstructor(theme: Theme = {}) {
  const appStyle = { ...defaultStyle, ...theme };
  return StyleSheet.create({
    container: {
      alignSelf: 'stretch',
      alignItems: 'center'
    },
    base: {
      width: 32,
      height: 32,
      alignItems: 'center'
    },
    conntainerFillter: {
      position: "absolute",
      width: "100%",
      height: "100%",
      flexDirection: "row"
    },
    fillter: {
      flex: 1,
    },
    text: {
      marginTop: constants.isAndroid ? 4 : 6,
      fontSize: appStyle.textDayFontSize,
      fontFamily: "Rubik-Regular",
      fontWeight: "400",
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      paddingTop: Platform.OS === "android" ? 3 : 0,
      ...appStyle.textDayStyle
    },
    alignedText: {
      marginTop: constants.isAndroid ? 4 : 6
    },
    selected: {
      backgroundColor: "#00ADB2",
      borderRadius: 5
    },
    selectedBetween: {
      backgroundColor: "#E5F7F7"
    },
    today: {
      borderWidth: 1,
      borderColor: "#00ADB2",
      borderRadius: 5,
    },
    todayText: {
      color: "#00ADB2"
    },
    selectedText: {
      color: "#FFFFFF"
    },
    disabledText: {
      color: "#7B8687"
    },
    lineTextDisable: {
      position: "absolute",
      width: "70%",
      height: 1,
      backgroundColor: "#7B8687",
      top: "50%"
    },
    inactiveText: {
      color: appStyle.textInactiveColor
    },
    dot: {
      width: 4,
      height: 4,
      marginTop: 1,
      borderRadius: 2,
      opacity: 0,
      ...appStyle.dotStyle
    },
    visibleDot: {
      opacity: 1,
      backgroundColor: appStyle.dotColor
    },
    selectedDot: {
      backgroundColor: appStyle.selectedDotColor
    },
    disabledDot: {
      backgroundColor: appStyle.disabledDotColor || appStyle.dotColor
    },
    todayDot: {
      backgroundColor: appStyle.todayDotColor || appStyle.dotColor
    },
    // @ts-expect-error
    ...(theme['stylesheet.day.basic'] || {})
  });
}
