import { StyleSheet, Text, View,TouchableOpacity,ActivityIndicator,TextInput } from 'react-native'
import React, { useState } from 'react'
import { COLORS,SIZES } from '../../../../../constants/themes'
import Icon from 'react-native-vector-icons/FontAwesome'
import RatingCont from '../../HotelsSearch/HotelDetails/AddReview/RatingCont'
import { Dialog,ALERT_TYPE } from 'react-native-alert-notification'

const Feedback = ({setFeedbackPage}) => {
    const [feedback,setFeedback]=useState({
        rating : 0,
        title : "",
        des : "",
        createdAt : "",
        sentBy:""
    })
    const [loading,setLoading]=useState(false)
    const submitFeedback=async()=>{
        setLoading(true)
        setTimeout(()=>{
            setLoading(false)
            // alert('Thanks for your valueble feedback!')
            Dialog.show({
              type:ALERT_TYPE.SUCCESS,
              title:'SUCCESS',
              textBody:'Thanks for your valuable feedback!',
              button:'OK',
            })
            console.log(feedback)
            setFeedbackPage(false)
        },3000)
    }
  return (
    <View style={styles.view}>
    <TouchableOpacity style={styles.backIcon} onPress={()=>{setFeedbackPage(false)}}>
        <Icon name="angle-left" size={25} color={COLORS.black}/> 
    </TouchableOpacity>
    {/* < */}
  <Text style={styles.title}>Feedback</Text>
  <View style={styles.line}/>
  <View style={styles.inputCont}>
    <RatingCont review={feedback} setReview={setFeedback}/>
    <TextInput 
      placeholder='Subject for feedback'
      value={feedback.title}
      placeholderTextColor={COLORS.black}
      style={styles.inputs}
      onChangeText={value=>setFeedback({...feedback,title:value})}/>
    <TextInput
      placeholder='What do you like/dislike?'
      value={feedback.des}
      placeholderTextColor={COLORS.black}
      onChangeText={value=>setFeedback({...feedback,des:value})}
      numberOfLines={15}
      multiline={true}  
      style={styles.bigInput}/>
    <TouchableOpacity style={styles.btn} onPress={submitFeedback}>
      <Text style={styles.btnText}>Submit</Text>
    </TouchableOpacity>  
  </View>
  <ActivityIndicator animating={loading} size={40} style={styles.loader}/>
</View>
  )
}

export default Feedback

const styles = StyleSheet.create({
    view:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        width:'100%',
        height:'100%',
        backgroundColor:COLORS.mainGrey
      },
      title:{
        color:COLORS.black,
        fontWeight:'bold',
        fontSize:SIZES.large-3
      },
      backIcon:{
        display:'flex',
        flexDirection:'row',
        width:'100%',
        marginTop:10,
        justifyContent:'flex-start',
        paddingLeft:30,
      },
      inputs:{
        borderColor: COLORS.mainPurple,
        borderWidth: 1,
        borderRadius: 13,
        width: '100%',
        marginBottom: 10,
        height: 50,
        padding: 15,
        color: COLORS.black,
        fontSize: SIZES.preMedium,
      },
      
      line:{
        width:'100%',
        backgroundColor:COLORS.black,
        opacity:0.2,
        height:1,
        marginVertical:15
      },
      inputCont:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        width:'85%',
      },
      bigInput:{
        height:150,
        width:'100%',
        borderWidth:1,
        borderColor:COLORS.mainPurple,
        borderRadius:20,
        color:COLORS.black,
        textAlignVertical:'top',
        padding:15,
        fontSize:SIZES.small
      },
      btn:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:12,
        width:'100%',
        borderRadius:12,
        backgroundColor:COLORS.mainPurple,
        marginVertical:25
      },
      btnText:{
        fontSize:SIZES.medium,
        color:COLORS.white,
        fontWeight:'bold'
      },
      loader:{
        position:'absolute',
        top:'45%',
        left:'45%'
      }
})