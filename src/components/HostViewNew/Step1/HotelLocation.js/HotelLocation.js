import { Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React,{useState} from 'react'
import SaveBtn from '../../Reusables/SaveBtn'
import BottomBtn from '../../Reusables/BottomBtn'
import { SIZES,COLORS } from '../../../../constants/themes'
import Icon from 'react-native-vector-icons/EvilIcons'
import { images } from '../../../../constants'
import { useDispatch, useSelector } from 'react-redux'
import { setListing } from '../../../../redux/NewListing/actions'
import PickLocation from './PickLocation'
import FillAdress from './FillAdress'
import CustomPopAlert from '../../../NavScreens/CustomPopAlert'

const HotelLocation = ({setHostModal,pos}) => {

  const [showAlertPop, setShowAlertPop] = useState({
    show: false,
    title: '',
    message: '',
    color: '',
  });

  const [location,setLocation]=useState("Ludhiana")
  const [coords, setCoords] = useState({
    latitude: 6.8523,
    longitude: 79.8895,
    latitudeDelta: 0.0421,
    longitudeDelta: 0.0421,
  });
  const [showLocationPicker,setShowLocationPicker]=useState(false)
  const [showAddressForm,setShowAddressForm]=useState(false)
  const {listing}=useSelector(state=>state.listingReducer)
  const dispatch=useDispatch()
  const checkEmpty=()=>{
    if(location!="Ludhiana"){
      dispatch(setListing({...listing,hotelLocation:location}))
      return true
    }else{
      // alert('Please select a location before moving forward!')
      setShowAlertPop({
        show: true,
        title: 'Please select a location before moving forward!',
        message: '',
        color: 'black',
      });
      return false
    }
  }
  return (
    <View style={styles.view}>
      <SaveBtn setHostModal={setHostModal}/> 
      <Text style={styles.title}>Where’s your place located?</Text>
      <Text style={styles.text}>Our comprehensive verification system checks details such as name, address.</Text>
      
      <TouchableOpacity style={styles.searchBar} onPress={()=>setShowLocationPicker(true)}>
        <Icon name='location' size={20} color={COLORS.black} style={styles.icon}/>
        <Text style={styles.inputText}>Enter Your Address</Text>
      </TouchableOpacity>
      <Image source={images.map2} style={styles.map}/>
      <BottomBtn setHostModal={setHostModal} pos={pos} step={1} nextFunc={checkEmpty}/>
      <Modal transparent animationType='slide' visible={showLocationPicker}>
        <PickLocation setShowAddressForm={setShowAddressForm} setShowLocationPicker={setShowLocationPicker} coords={coords} setCoords={setCoords} setLocation={setLocation} location={location}/>
      </Modal>
      <Modal transparent animationType='slide' visible={showAddressForm}>
        <FillAdress self={setShowAddressForm} setLocation={setLocation} location={location}/>
      </Modal>

      <Modal visible={showAlertPop.show} transparent>
        <CustomPopAlert
          title={showAlertPop.title}
          message={showAlertPop.message}
          color={showAlertPop.color}
          onCloseRequest={setShowAlertPop}
        />
      </Modal>

    </View>
  )
}

export default HotelLocation

const styles = StyleSheet.create({
    view:{
        display:'flex',
        flexDirection:'column',
        alignItems:'flex-start',
        width:'100%',
        height:'100%',
        backgroundColor:COLORS.mainGrey
    },
    title:{
        width:'88%',
        color:COLORS.mainPurple,
        fontSize:SIZES.xxLarge,
        fontWeight:'500',
        marginBottom:8,
        marginLeft:'8%',
    },
    text:{
        fontSize:SIZES.preMedium,
        color:COLORS.black,
        fontWeight:"300",
        width:'75%',
        marginLeft:'8%',
        
    },
    searchBar:{
        borderColor:COLORS.mediumGrey,
        borderWidth:1,
        display:'flex',
        width:'85%',
        flexDirection:'row',
        justifyContent:'flex-start',
        marginVertical:15,
        alignItems:'center',
        borderRadius:40,
        marginLeft:'6%',
        height:45
    },
    icon:{
        marginLeft:15,
        marginRight:10
    },
    inputText:{
        fontSize:SIZES.small,
        fontWeight:'bold',
        color:COLORS.black,
        opacity:0.7
    },
    map:{
        marginLeft:'6%',
        borderRadius:10,
        objectFit:'fill'
    }
})