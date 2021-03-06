import {StyleSheet, Platform} from 'react-native';
import * as defaultStyle from '../../style';
import {Theme} from '../../types';

export default function (theme: Theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 6,
      alignItems: 'center'
    },
    headerContainer: {
      flexDirection: 'row'
    },
    monthText: {
      fontSize: appStyle.textMonthFontSize,
      fontFamily: "Rubik-Regular",
      fontWeight: appStyle.textMonthFontWeight,
      color: appStyle.monthTextColor,
      margin: 10
    },
    arrow: {
      padding: 10,
      ...appStyle.arrowStyle
    },
    arrowImage: {
      tintColor: appStyle.arrowColor,
      ...Platform.select({
        web: {
          width: appStyle.arrowWidth,
          height: appStyle.arrowHeight
        }
      })
    },
    disabledArrowImage: {
      tintColor: appStyle.disabledArrowColor
    },
    colorIcon:{
      tintColor:"#FFFFFF"
    },
    txtWhite:{
      color:"#FFFFFF"
    },
    // @ts-expect-error
    week: {
      marginTop: 7,
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    dayHeader: {
      marginTop: 2,
      marginBottom: 7,
      width: 32,
      textAlign: 'center',
      fontSize: appStyle.textDayHeaderFontSize,
      fontFamily: "Rubik-Regular",
      fontWeight: "500",
      color: "#7B8687"
    },
    disabledDayHeader: {
      color: appStyle.textSectionTitleDisabledColor
    },
    ...(theme['stylesheet.calendar.header'] || {})
  });
}
