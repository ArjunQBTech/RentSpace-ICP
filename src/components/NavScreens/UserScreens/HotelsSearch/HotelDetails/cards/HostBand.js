import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../../../../../../constants/themes'
import { images } from '../../../../../../constants'

const HostBand = ({hostData}) => {
  return (
    <View style={styles.band}>
      <View style={styles.subCont}>
        <Image source={(hostData?.userProfile==""||hostData?.userProfile=="img")?images.sampleProfile2:{uri:hostData?.userProfile}} style={styles.img}/>
        <View style={styles.TextCont}>
            <Text style={styles.Title}>Entire place hosted by {hostData?.firstName}!</Text>
            <Text style={styles.simpleText}>8 guests · 2 bedrooms · 3 beds · 2 bathrooms</Text>
        </View>
      </View>
    </View>
  )
}

export default HostBand

const styles = StyleSheet.create({
    band:{
        width:'100%',
        backgroundColor:COLORS.mainPurple,
        height:95,
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },
    subCont:{
      display:'flex',
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'center',
      height:'100%',
      width:'80%'
    },
    img:{
      width:60,
      height:60,
      borderRadius:10,
      marginRight:25
    },
    TextCont:{
      display:'flex',
      flexDirection:'column',
      height:52,
      width:'70%',
      justifyContent:'space-between'
    },
    Title:{
      color:COLORS.white,
      fontSize:SIZES.preMedium,
      fontWeight:'bold'
    },
    simpleText:{
      color:COLORS.black,
      fontSize:SIZES.xSmall,
      width:'90%'
    }
})