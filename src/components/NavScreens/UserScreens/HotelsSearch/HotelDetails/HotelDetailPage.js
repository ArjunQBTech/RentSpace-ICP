import { StyleSheet, Text, View ,TouchableOpacity,Image,ScrollView, Modal} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLORS,SIZES } from '../../../../../constants/themes'
import { images } from '../../../../../constants'
import Icon2 from 'react-native-vector-icons/AntDesign'
import HostBand from './cards/HostBand'
import HotelFacilityCard from './cards/HotelFacilityCard'
import ReserveBtn from './cards/ReserveBtn'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import Reviews from './subComponents/Reviews/Reviews'
import { useSelector } from 'react-redux'
import BookingFormComp from './BookingForm/BookingFormComp'
import FirstForm from './BookingForm/FirstForm'
import { Principal } from '@dfinity/principal'

const HotelDetailPage = ({item,setOpen,navigation}) => {
    const btmBtn=useRef(null)
    const [hotelReviews,setHotelReviews]=useState([])
    const [bookingForm,setBookingForm]=useState(false)
    const {actors}=useSelector(state=>state.actorReducer)
    const [host,setHost]=useState({})

    const getAllReviews=async()=>{
        console.log(actors?.reviewActor.getReviewIdsFromHotelId)
        console.log(item?.id)
        let Revs=[]
        await actors?.reviewActor.getReviewIdsFromHotelId(item?.id).then(async(res)=>{
            console.log("review ids: ",res)
            res.map(async(r)=>{
                await actors?.reviewActor.getReviewInfo(r).then((res)=>{
                    console.log(res) 
                    Revs.push(res[0])
                    setHotelReviews([...Revs])
                }).catch((err)=>{console.log(err)})
            })
            
        }).catch((err)=>console.log(err))
    }
    const getHostDetails=async()=>{
        const hostId=item.id.split('#')[0]
        await actors?.userActor?.getUserInfoByPrincipal(Principal.fromText(hostId)).then((res)=>{
            console.log(res)
            setHost({...res[0],id:hostId})
        }).catch((err)=>{
            console.log(err)
        })
    }
    useEffect(()=>{
        btmBtn.current.present()
        getAllReviews()
        getHostDetails()
    },[])
  return (
    <BottomSheetModalProvider>
    <ScrollView>
    <View style={styles.bottomSheet} >
      <TouchableOpacity style={styles.backIcon} onPress={()=>{setOpen(false)}}>
        <Icon name="angle-left" size={30} color={COLORS.textLightGrey} />    
      </TouchableOpacity> 
      <Image source={{uri:item?.details?.imagesUrls[0].url}} style={styles.hotelImg}/>
      <View style={styles.hotelTitleReviewCont}>
        <View style={styles.hotelTitleCont}>
            <Text style={styles.hotelTitle}>{item?.hotelTitle}</Text>
            <TouchableOpacity style={styles.likeCont}>
                <Icon2 name="hearto" size={20} color={COLORS.textLightGrey} />
            </TouchableOpacity>    
        </View>
        <View style={styles.hotelReviewCont}>
            <Icon2 name='star' size={12} color={COLORS.inputBorder} style={{marginRight:5}}/>
            
            <Text style={styles.hotelReviewText}>4.92 • 432 reviews • {item?.hotelLocation}</Text>
        </View>
      </View>
      <HostBand hostData={host}/>
      <View style={[styles.allCont,{marginVertical:25}]}>
        <HotelFacilityCard hostData={host}/>
      </View>
      <View style={styles.hrLine}></View>
      <Reviews reviews={hotelReviews}/>  
        <TouchableOpacity style={styles.btn} onPress={()=>{
            navigation.navigate('UserChat',{newChat:host?.id})
            setOpen(false)
        }}>
            <Text style={styles.btnText}>Chat with {host?.firstName}</Text>
        </TouchableOpacity>
      <BottomSheetModal ref={btmBtn} index={0} snapPoints={['12']} style={{elevation:10,backgroundColor:'white'}}>
        <ReserveBtn item={item} onClick={()=>setBookingForm(true)}/>
      </BottomSheetModal>
      <Modal animationType='slide' visible={bookingForm} transparent>
        <FirstForm setBookingForm={setBookingForm} item={item} setOpen={setOpen}/>
      </Modal>
    </View>
    </ScrollView>
    </BottomSheetModalProvider>
  )
}

export default HotelDetailPage

const styles = StyleSheet.create({
    bottomSheet:{
        width:"100%",
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        height:'100%',
        paddingBottom:100,
        height:'100%',
        paddingBottom:100
    },
    backIcon:{
        display:'flex',
        flexDirection:'row',
        width:'100%',
        marginTop:10,
        justifyContent:'flex-start',
        paddingLeft:30
    },
    hotelImg:{
        width:'100%',
        height:220
    },
    hotelTitle:{
        width:"90%",
        fontSize:SIZES.large,
        fontWeight:'bold',
        color:"black",
        marginRight:15
    },
    hotelTitleReviewCont:{
        display:'flex',
        flexDirection:'column',
        alignItems:'flex-start',
        width:'90%',
        marginTop:15,
        marginLeft:40
    },
    hotelTitleCont:{
        display:'flex',
        flexDirection:'row',
        width:'90%',
        alignItems:'flex-start'
    },
    likeCont:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        marginTop:3
    },
    hotelReviewCont:{
        display:'flex',
        flexDirection:'row',
        width:'100%',
        alignItems:'flex-start',
        marginVertical:12
    },
    hotelReviewText:{
        width:"80%",
        fontSize:SIZES.xSmall,
        color:"black",
        marginBottom:15,
        opacity:0.6
    },
    allCont:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        width:'100%'
    },
    hrLine:{
        height:2,
        borderBottomWidth:2,
        borderBottomColor:COLORS.hrLine,
        width:"100%",
        marginBottom:20
    },
    btn:{
        width:'80%',
        borderRadius:12,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        paddingVertical:15,
        backgroundColor:COLORS.hostTitle
    },
    btnText:{
        fontSize:SIZES.preMedium,
        color:'white',
        fontWeight:'bold'
    }
})