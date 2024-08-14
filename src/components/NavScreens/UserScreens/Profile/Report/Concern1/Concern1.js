import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS,SIZES } from '../../../../../../constants/themes'
import Icon from 'react-native-vector-icons/Entypo'
import TopicOption from './TopicOption'
import LinkOption from './LinkOption'
import BottomBtn from '../BottomBtn'
import HotelAddress from './HotelAddress'

const complaintTopics=[
    {
        tag:"noise",
        text:"Noise or party"
    },
    {
        tag:"neighbourhood",
        text:"Neighbourhood concerns" 
    },
    {
        tag:"safety",
        text:"Personal safety"
    },
    {
        tag:"other",
        text:"Other"
    }
]
const linkOptions=[
    {
        tag:true,
        text:"Yes, I have the link to the listing"
    },
    {
        tag:false,
        text:"No, I only know the address"
    }
]
const Concern1 = ({setConcernForm,setReport,report}) => {
    const [topic,setTopic]=useState(complaintTopics[0].tag)
    const [linkOp,setLinkOp]=useState(false)
  return (
    <View style={styles.modal}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.topNav}>
            <TouchableOpacity style={{marginLeft:'2%'}} onPress={()=>setConcernForm(0)}>
                <Icon name='chevron-small-left' color={COLORS.black} size={30}/>
            </TouchableOpacity>
        </View>
        <Text style={styles.title2}>Report</Text>
        <Text style={styles.title}>Report a concern</Text>
        <Text style={styles.normalText}>
            All fields are required unless otherwise noted.
        </Text>
        <Text style={styles.sectionHeading}>
            What’s your concern about?
        </Text>
        {
            complaintTopics.map((item,index)=>(
                <TopicOption item={item} key={index} setTopic={setTopic} topic={topic} setReport={setReport} report={report}/>
            ))
        }

        {/* <Text style={styles.sectionHeading}>
            Do you have the link to the RentSpace listing for this home?
        </Text>
        {
            linkOptions.map((item,index)=>(
                <LinkOption key={index} item={item} setLinkOp={setLinkOp} linkOp={linkOp}/>
            ))
        } */}
      </ScrollView>
      <BottomBtn step={1} nextText={"Next"} setConcernForm={setConcernForm} onClickNext={()=>setConcernForm(2)}/>
    </View>
  )
}

export default Concern1

const styles = StyleSheet.create({
    modal:{
        width:'100%',
        height:'100%',
        backgroundColor:COLORS.newBG,
    },
    page:{
        display:'flex',
        flexDirection:'column',
        alignItems:'flex-start',
        minHeight:'100%',
        width:'100%',
        paddingBottom:150,
        marginTop:10
      },
      topNav:{
        width:'100%',
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
        fontWeight:'600',
      },
      title2:{
        color:COLORS.black,
        fontSize:SIZES.xLarge,
        marginLeft:'5.5%',
        width:'85%',
        fontWeight:'600',
        marginTop:10,
        marginBottom:25
      },
      normalText:{
        color:COLORS.black,
        fontSize:SIZES.medium,
        marginLeft:'7%',
        width:'80%',
        fontWeight:'400',
        marginVertical:10,
        opacity:0.7,
        lineHeight:22
      },
      sectionHeading:{
        color:COLORS.black,
        fontSize:SIZES.large,
        marginLeft:'7%',
        width:'85%',
        fontWeight:'bold',
        marginTop:15,
        lineHeight:28,
        marginBottom:12
      },
})