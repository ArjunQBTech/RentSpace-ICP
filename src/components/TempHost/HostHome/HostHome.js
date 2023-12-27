import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS,SIZES } from '../../../constants/themes'
import BottomNavHost from '../../Navigation/BottomNavHost'
import IdentityCard from './IdentityCard'
import Reservations from '../Reservations/Reservations'
import IDProcessManager from './Identification/IDProcessManager'
import ChatDrawer from '../ChatPage/ChatDrawer/ChatDrawer'


const HostHome = ({navigation}) => {
  const data=[
    {
      title:"Checking out",
      count:0
    },
    {
      title:"Currently hosting",
      count:0
    },
    {
      title:"Arriving soon",
      count:0
    }
  ]
  const [idprocess,setIdprocess]=useState(0)
  const [reservationType,setReservationType]=useState(data[0].title)
  const [showReservation,setShowReservations]=useState(false)
  const [showDrawer,setShowDrawer]=useState(false)
  return (
    <View style={styles.view}>
      <Text style={styles.title}>Welcome, Lucy!</Text>
      <IdentityCard setIdprocess={setIdprocess}/>
      <Text style={styles.subHeading}>Your reservations</Text>
      <FlatList style={styles.reservationTitleList} data={data} renderItem={(item)=>{
        return(
            <TouchableOpacity 
              onPress={()=>setReservationType(item.item.title)}
              style={(item.item.title==reservationType)?styles.selectedReservationType:styles.reservationType}>
              <Text style={(item.item.title==reservationType)?styles.selectedReservationTypeText:styles.reservationTypeText}>
                {item.item.title} ({item.item.count})
              </Text>
            </TouchableOpacity> 
        )
      }}
      horizontal={true}
      />
      <View style={styles.reservationsCont}>
        <Text style={styles.simpleText}>Sorry!</Text>
        <Text style={styles.simpleText}>
You don’t have any guest checking out today or tomorrow
        </Text>
      </View>
      <TouchableOpacity style={{marginLeft:'5%'}} onPress={()=>setShowReservations(true)}>
        <Text style={styles.link}>All resevations (0)</Text>
      </TouchableOpacity>
      <BottomNavHost navigation={navigation} showDrawer={showDrawer} setShowDrawer={setShowDrawer}/>
      {/*Modals */}
      <Modal animationType='fade' visible={showDrawer} transparent>
        <ChatDrawer navigation={navigation} showDrawer={showDrawer} setShowDrawer={setShowDrawer}/>
      </Modal>
      <Modal animationType='slide' visible={showReservation}>
        <Reservations setShowReservations={setShowReservations}/>
      </Modal>
      <Modal animationType='slide' visible={(idprocess>0)?true:false}>
        <IDProcessManager idprocess={idprocess} setIdprocess={setIdprocess}/>
      </Modal>
    </View>
  )
}

export default HostHome

const styles = StyleSheet.create({
    view:{
        display:'flex',
        flexDirection:'column',
        alignItems:'flex-start',
        height:'100%',
        backgroundColor:'white'
    },
    title:{
        width:'45%',
        color:COLORS.hostTitle,
        fontSize:SIZES.xxLarge,
        fontWeight:'500',
        marginBottom:30,
        marginLeft:'5%',
        marginTop:40
    },
    subHeading:{
      marginLeft:'5%',
      marginVertical:20,
      fontSize:SIZES.large,
      color:COLORS.black,
      fontWeight:'600'
    },
    reservationTitleList:{
      maxHeight:52,
      marginLeft:'5%'
    },
    reservationType:{
      display:'row',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      borderWidth:1,
      borderColor:COLORS.hostTitle,
      height:40,
      paddingHorizontal:10,
      marginHorizontal:6,
      borderRadius:30
    },
    reservationTypeText:{
        fontSize:SIZES.small,
        color:COLORS.textLightGrey,
        fontWeight:'600'
    },
    selectedReservationType:{
      display:'row',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      borderWidth:1,
      borderColor:COLORS.hostTitle,
      height:40,
      paddingHorizontal:10,
      marginHorizontal:6,
      borderRadius:30,
      backgroundColor:COLORS.hostTitle
    },
    selectedReservationTypeText:{
      fontSize:SIZES.small,
      color:'white',
      fontWeight:'400',
  },
  reservationsCont:{
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:COLORS.lighterGrey,
    width:'90%',
    marginLeft:'5%',
    borderRadius:20,
    minHeight:220
  },
  simpleText:{
    fontSize:SIZES.preMedium,
    color:COLORS.textLightGrey,
    textAlign:'center',
    maxWidth:'70%',
    marginBottom:10,
    fontWeight:'300'
  },
  link:{
      fontSize:SIZES.preMedium,
      textDecorationLine:'underline',
      color:COLORS.textLightGrey,
      marginVertical:3,
      fontWeight:'500',
      marginTop:15
  }
})