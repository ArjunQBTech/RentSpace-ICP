import { TextInput, StyleSheet, Text, View, Modal } from 'react-native'
import React, { useState } from 'react'
import { COLORS,SIZES } from '../../../../constants/themes'
import SaveBtn from '../../Reusables/SaveBtn'
import BottomBtn from '../../Reusables/BottomBtn'
import { useDispatch, useSelector } from 'react-redux'
import { setListing } from '../../../../redux/NewListing/actions'
import { Dialog,ALERT_TYPE } from 'react-native-alert-notification'

const HotelDesc = ({setHostModal,pos}) => {

 

  const [len,setLen]=useState(0)
  const [desc,setDesc]=useState('')

  const dispatch=useDispatch()
  const {listing}=useSelector(state=>state.listingReducer)
  const descChange=(value)=>{
    if(value.length>500){
      // alert('Description cannot be longer than 500 characters')
      Dialog.show({
        type:ALERT_TYPE.WARNING,
        title:'WARNING',
        textBody:'Description cannot be longer than 500 characters',
        button:'OK',
      })
     
    }else{
      setLen(value.length)
      setDesc(value)
    }
  }
  const checkEmpty=()=>{
    if(desc==''){
      // alert("Please do not leave description empty")
      Dialog.show({
        type:ALERT_TYPE.WARNING,
        title:'WARNING',
        textBody:"Please do not leave description empty",
        button:'OK',
      })
      
      return false
    }else{
      dispatch(setListing({...listing,hotelDes:desc}))
      return true
    }
  }
  return (
    <View style={styles.view}>
      {/* <SaveBtn setHostModal={setHostModal}/> */}
      <Text style={styles.title}>Create your description</Text>
      <Text style={styles.text}>Our comprehensive verification system checks details such as name.</Text>
      <TextInput 
        onChangeText={value=>descChange(value)}
        style={styles.input} 
        value={desc}
        numberOfLines={25}
        multiline={true}
      />
      <Text style={styles.smallText}>{len}/500</Text>
      <BottomBtn back={2} setHostModal={setHostModal} pos={pos} step={2} nextFunc={checkEmpty}/>
      
    </View>
  )
}

export default HotelDesc

const styles = StyleSheet.create({
    view:{
      display:'flex',
      flexDirection:'column',
      alignItems:'flex-start',
      width:'100%',
      height:'100%',
      backgroundColor:COLORS.newBG
  },
  title:{
      width:'85%',
      color:COLORS.black,
      fontSize:SIZES.prexxLarge,
      fontWeight:'500',
      marginBottom:10,
      marginLeft:'8%',
      marginTop:20
  },
  text:{
      fontSize:SIZES.preMedium,
      color:COLORS.black,
      width:'85%',
      marginLeft:'7.5%',
      marginBottom:20
  },
  input:{
    height:200,
    width:'85%',
    marginLeft:'7.5%',
    borderWidth:1,
    borderColor:COLORS.black,
    borderRadius:20,
    color:COLORS.black,
    textAlignVertical:'top',
    padding:15,
    fontSize:SIZES.small
  },
  smallText:{
    fontSize:SIZES.xSmall,
    color:COLORS.black,
    marginLeft:'8.5%',
  }
})