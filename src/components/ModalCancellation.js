import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLORS } from '../constants/themes'

const ModalCancellation = ({setCancelModal}) => {
  return (
    <View style={styles.bottomSheet}>
      <TouchableOpacity style={styles.backIcon} onPress={()=>{setCancelModal(false)}}>
        <Icon name="angle-left" size={30} color={COLORS.textLightGrey}/>    
        </TouchableOpacity>  
    </View>
  )
}

export default ModalCancellation

const styles = StyleSheet.create({
    bottomSheet:{
        width:"100%",
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        height:'100%'
    },
    backIcon:{
        display:'flex',
        flexDirection:'row',
        width:'100%',
        marginVertical:10,
        justifyContent:'flex-start',
        paddingLeft:30
    }
})