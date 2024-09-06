import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../../../../../constants/themes'
import { images } from '../../../../../constants'

const RentSpaceCard = () => {
  return (
    <View style={styles.card}>
      <Image style={styles.img} source={images.logo}/>
      <View style={styles.textCont}>
        <Text style={styles.title}>
            RentSpace your place
        </Text>
        <Text style={styles.text}>
            It’s simple to get set up and start earning.
        </Text>
      </View>
    </View>
  )
}

export default RentSpaceCard

const styles = StyleSheet.create({
    card:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        width:'88%',
        borderRadius:16,
        borderWidth:1,
        borderColor:COLORS.hostTitle,
        backgroundColor:COLORS.darkPurple,
        height:110,
        marginVertical:15,
        elevation:5
    },
    textCont:{
        display:'flex',
        flexDirection:'column',
        width:'55%',
        justifyContent:'space-between',
        height:'72%'
    },
    img:{
        height:'100%',
        width:'18%',
        marginHorizontal:20,
        objectFit:'cover',
        opacity:0.6
    },
    title:{
        color:'white',
        fontSize:SIZES.largeMed-2,
        fontWeight:'800'
    },
    text:{
        color:'white',
        fontSize:SIZES.preMedium-1,
        fontWeight:'300',
        opacity:0.7
    }
})