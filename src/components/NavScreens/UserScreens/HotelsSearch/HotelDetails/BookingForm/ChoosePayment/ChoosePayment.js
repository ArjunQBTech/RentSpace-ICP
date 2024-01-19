import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS,SIZES } from '../../../../../../../constants/themes'

const ChoosePayment = () => {
  return (
    <View style={styles.sec}>
      <Text style={styles.heading}>Choose how to pay</Text>
    </View>
  )
}

export default ChoosePayment

const styles = StyleSheet.create({
    sec:{
        display:'flex',
        flexDirection:'column',
        alignItems:'flex-start',
        width:'85%'
    },
    heading:{
        color:COLORS.black,
        fontWeight:'800',
        fontSize:SIZES.preMedium
    }
})