import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React,{useState} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLORS,SIZES } from '../../../../../../constants/themes'
import RatingCont from './RatingCont'
import { useSelector } from 'react-redux'
import { Dialog,ALERT_TYPE } from 'react-native-alert-notification'

const AddReview = ({item,setAddReview}) => {
  const {actors}=useSelector(state=>state.actorReducer)
  const [loading,setLoading]=useState(false)
  

  // console.log("item : ",item.hotelId)

  const [review,setReview]=useState({
    hotelId:item?.hotelId,
    rating: 1,
    title: '',
    des: '',
  })
  
  const addNewReview = async () => {
    setLoading(true)
    console.log("reviewObj : ",review)
    // console.log("reviewActors : ",await actors.reviewActor.getPk())

    try {
      console.log("review : ",review)

      console.log('Review add', actors.reviewActor);

      if(review.title=='' || review.des==''){
        setLoading(false)
        Dialog.show({
          title: 'Something went wrong',
          type: ALERT_TYPE.WARNING,
          textBody: 'Please fill all the fields',
          button:'OK',

        });
        return
      }

      let reviewRes=await actors?.reviewActor?.createReview(review?.hotelId,review)
      console.log('review creation response : ', reviewRes);
      if(reviewRes?.err!=undefined){
        setLoading(false)
        Dialog.show({
          title: 'Something Went Wrong',
          type: ALERT_TYPE.DANGER,
          textBody: reviewRes?.err,
        });
        return
      }
        Dialog.show({
          title: 'SUCCESS',
          type: ALERT_TYPE.SUCCESS,
          textBody: 'Thanks for giving your valuable feedback',
        });
        setLoading(false)
        setAddReview(false)


    } catch (err) {
      console.log(err);
      setLoading(false)
      Dialog.show({
        title: 'Something went wrong',
        type: ALERT_TYPE.DANGER,
        textBody: 'Some Error Occured While Adding Your Review',
      });
    }
    

    
  };
 
  return (
    <View style={styles.view}>
        <TouchableOpacity style={styles.backIcon} onPress={()=>{setAddReview(false)}}>
            <Icon name="angle-left" size={25} color={COLORS.textLightGrey}/> 
        </TouchableOpacity>
        {/* < */}
      <Text style={styles.title}>Reviews/Ratings</Text>
      <View style={styles.line}/>
      <View style={styles.inputCont}>
        <RatingCont review={review} setReview={setReview}/>
        <TextInput 
          placeholder='Subject for review'
          value={review.title}
          placeholderTextColor={COLORS.black}
          style={styles.inputs}
          onChangeText={value=>setReview({...review,title:value})}/>
        <TextInput
          placeholder='What do you like/dislike?'
          value={review.des}
          placeholderTextColor={COLORS.black}
          onChangeText={value=>setReview({...review,des:value})}
          numberOfLines={15}
          multiline={true}  
          style={styles.bigInput}/>
        <TouchableOpacity style={styles.btn} onPress={addNewReview}>
          <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity>  
      </View>
      <ActivityIndicator animating={loading} size={40} style={styles.loader}/>
    </View>
  )
}

export default AddReview

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
        borderColor: COLORS.black,
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
        borderColor:COLORS.black,
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
        backgroundColor:COLORS.black,
        marginVertical:25
      },
      btnText:{
        fontSize:SIZES.medium,
        color:'white',
        fontWeight:'bold'
      },
      loader:{
        position:'absolute',
        top:'45%',
        left:'45%'
      }
})