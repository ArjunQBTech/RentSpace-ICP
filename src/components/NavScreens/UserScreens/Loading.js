import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import { COLORS } from '../../../constants/themes'

const Loading = () => {
  return (
    <View style={styles.loaderCont}>
      <ActivityIndicator animating={true} size="large" color={COLORS.black} />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
    loaderCont: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        opacity: 0.8
    },
})