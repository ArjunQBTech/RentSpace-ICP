import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS,SIZES } from '../../../../../../../constants/themes'

const RequiredPhone = () => {
  return (
    <View style={styles.sec}> 
      <Text style={styles.heading}>Required for your trip</Text>
    </View>
  )
}

export default RequiredPhone

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
    },
})