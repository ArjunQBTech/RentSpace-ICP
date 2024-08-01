import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../../../../../constants/themes'
import Chat from '../ChatComponents/Chat'
import { images } from '../../../../../constants'
import { useEffect } from 'react'

const ChatCard = ({item,setOpenChat,openChat,setChat}) => {
  useEffect(()=>{
    console.log("chat Card item",item.ok);
  },[])
  return (
    <>
    <TouchableOpacity style={styles.card} onPress={()=>{
      setOpenChat(true)
      setChat(item)
      }}>
        <Image source={(item?.ok?.userImage==""||item?.ok?.userImage=="img")?images.sampleProfile2:{uri:item?.ok?.userImage}} style={styles.img}/>
      <Text style={styles.title}>{item?.ok?.firstName}</Text>
      {/* <Text style={styles.time}>Mon</Text> */}
    </TouchableOpacity>
    
    </>
  )
}

export default ChatCard

const styles = StyleSheet.create({
    card:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        backgroundColor:'white',
        width:'85%',
        marginLeft:'7.5%',
        elevation:5,
        height:70,
        borderRadius:12,
        marginVertical:12
    },
    title:{
        color:COLORS.black,
        fontSize:SIZES.medium,
        marginLeft:15
    },
    time:{
        color:COLORS.textLightGrey,
        opacity:0.3,
        fontWeight:'300',
        fontSize:SIZES.small,
        position:'absolute',
        right:'2%',
        top:'30%'
    },
    img:{
      width:70,
      height:50,
      borderRadius:10,
      marginLeft:14,
      objectFit:'cover'
    }
})