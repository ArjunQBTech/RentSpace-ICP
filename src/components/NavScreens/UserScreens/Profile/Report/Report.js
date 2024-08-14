import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo'
import { COLORS, SIZES } from '../../../../../constants/themes'
import Icon2 from 'react-native-vector-icons/Ionicons'
import Concern1 from './Concern1/Concern1'
import Concern2 from './Concern2.js/Concern2'

const Report = ({setReportPage}) => {
  const [concernForm,setConcernForm]=useState(0)
  const [report,setReport]=useState({
    reason:"Noise and party",
    hostMessage:"",
    adminMessage:"",
    address:{
      region:"",
      streetAddress:"",
      building:"",
      city:"",
      country:"",
      postalCode:""
    }
  })
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.topNav}>
        <TouchableOpacity style={{marginLeft:'2%'}} onPress={()=>setReportPage(false)}>
          <Icon name='chevron-small-left' color={COLORS.black} size={30}/>
        </TouchableOpacity>
      </View>
      <Text style={styles.title2}>Report</Text>
      <Text style={styles.largeText}>How-to</Text>
      <Text style={styles.title}>Neighbourhood Support</Text>
      <Text style={styles.normalText}>
        You can report a party, noise complaint or neighbourhood concern here
      </Text>
      <Text style={styles.normalText}>
        For help with reservations, hosting or your account,{" "} 
        <Text style={{fontWeight:'bold',opacity:1}}>
          contact RentSpace support 
        </Text>
        {" "}
        - our neighbourhood Support Team is only available to help with concerns related to hone sharing in your community.
      </Text>
      <View style={styles.card}>
        <Icon2 name='newspaper-outline' color={COLORS.black} size={20} style={{marginRight:10}}/>
        <Text style={styles.smallText}>
           I agree to treat everyone in the RentSpace community -regardless of their race, religion, national origin, ethnicity, skin colour, disability, sex, gender identity, sexual orientation or age - with respect, and without judgement or bias.
        </Text>
      </View>
      {/* <Text style={styles.sectionHeading}>
        Urgent neighbourhood situations
      </Text>
      <Text style={styles.normalText}>
       You can report a party, noise complaint or neighbourhood concern here
      </Text> */}
      {/* <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>
          Request a call
        </Text>
      </TouchableOpacity> */}
      <Text style={styles.sectionHeading}>
        Urgent neighbourhood situations
      </Text>
      <Text style={styles.normalText}>
       You can report a party, noise complaint or neighbourhood concern here
      </Text>
      <TouchableOpacity style={styles.btn} onPress={()=>setConcernForm(1)}>
        <Text style={styles.btnText}>
          Report a concern
        </Text>
      </TouchableOpacity>
      <Modal animationType='slide' visible={concernForm==1}>
        <Concern1 setConcernForm={setConcernForm} setReport={setReport} report={report}/>
      </Modal>
      <Modal animationType='slide' visible={concernForm==2}>
        <Concern2 setConcernForm={setConcernForm} setReportPage={setReportPage} setReport={setReport} report={report}/>
      </Modal>
    </ScrollView>
  )
}

export default Report

const styles = StyleSheet.create({
  page:{
    display:'flex',
    flexDirection:'column',
    alignItems:'flex-start',
    minHeight:'100%',
    width:'100%',
    backgroundColor:COLORS.newBG,
    paddingBottom:40,
  },
  topNav:{
    width:'100%',
    backgroundColor:COLORS.newBG,
    padding:0,
    display:'flex',
    flexDirection:'column',
    alignItems:'flex-start',
    justifyContent:'center'
  },
  title:{
    color:COLORS.black,
    fontSize:SIZES.xxLarge,
    marginLeft:'7%',
    width:'70%',
    fontWeight:'600'
  },
  title2:{
    color:COLORS.black,
    fontSize:SIZES.xLarge,
    marginLeft:'5.5%',
    width:'85%',
    fontWeight:'600',
    marginVertical:10
  },
  normalText:{
    color:COLORS.black,
    fontSize:SIZES.medium-1,
    marginLeft:'7%',
    width:'85%',
    fontWeight:'400',
    marginVertical:10,
  },
  largeText:{
    color:COLORS.black,
    fontSize:SIZES.largeMed,
    marginLeft:'7%',
    width:'85%',
    marginTop:15,
    marginBottom:5
  },
  sectionHeading:{
    color:COLORS.black,
    fontSize:SIZES.large,
    marginLeft:'7%',
    width:'85%',
    fontWeight:'bold',
    marginTop:15
  },
  smallText:{
    color:COLORS.black,
    fontSize:SIZES.preMedium-1,
    width:'80%',
    fontWeight:'400'
  },
  card:{
    display:'flex',
    flexDirection:'row',
    alignItems:'flex-start',
    width:'85%',
    marginLeft:'7.5%',
    borderWidth:1,
    borderColor:COLORS.black,
    borderRadius:12,
    paddingVertical:20,
    justifyContent:'center',
    marginTop:15
  },
  btn:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:12,
    backgroundColor:COLORS.black,
    paddingVertical:12,
    paddingHorizontal:15,
    marginLeft:'7.5%',
    marginVertical:10,
  },
  btnText:{
    color:COLORS.white,
    fontSize:SIZES.medium,
    fontWeight:'bold',

  }
})