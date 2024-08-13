import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, NativeModules } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES } from '../../../../constants/themes'
import Line from '../../../HostViewNew/Reusables/Line'
import MenuItem from './MenuItem'
import Icon from 'react-native-vector-icons/AntDesign'
import Icon2 from 'react-native-vector-icons/Feather'
import Icon3 from 'react-native-vector-icons/Ionicons'
import Icon4 from 'react-native-vector-icons/MaterialIcons'
import Icon5 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon6 from 'react-native-vector-icons/Fontisto'
import { useDispatch } from 'react-redux'
import { setActor } from '../../../../redux/actor/actions'
import { backend } from '../../../../declarations/backend'
import { User } from '../../../../declarations/User'
import { Hotel } from '../../../../declarations/Hotel'
import { setUser } from '../../../../redux/users/actions'
import { setHotels } from '../../../../redux/hotels/actions'
import { setPrinciple } from '../../../../redux/principle/actions'
import Terms from '../../UserScreens/Profile/TermAndConditions/Terms'
import Privacy from '../../UserScreens/Profile/Privacy/Privacy'

const MenuPage = ({navigation}) => {

    const [showTerms,setShowTerms]=useState(false)
    const [showPrivacy,setShowPrivacy]=useState(false)

    const hostingItems=[
        {
            title:'Reservations',
            icon:<Icon3 name='bag-check-outline' size={25} color={COLORS.black}/>,
            onClick:()=>{navigation.navigate('hostHome')}
        },
        {
            title:'View Spaces',
            icon:<Icon name='home' size={25} color={COLORS.black}/>,
            onClick:()=>{navigation.navigate('hostListing')}
        },
        {
            title:'Update Space Availabilities',
            icon:<Icon6 name='date' size={25} color={COLORS.black}/>,
            onClick:()=>{navigation.navigate('hotelAvailable')}
        },
        // {
        //     title:'Guidebooks',
        //     icon:<Icon name='book' size={25} color={COLORS.black}/>,
        //     onClick:()=>{}
        // },
        {
            title:'List a new Space',
            icon:<Icon5 name='home-plus-outline' size={25} color={COLORS.black}/>,
            onClick:()=>{navigation.navigate('hostListing')}
        }
    ]
    const accountItems=[
        {
            title:"Profile",
            icon:<Icon name='user' size={25} color={COLORS.black}/>,
            onClick:()=>{navigation.navigate('profile')}
        },
        {
            title:'Book Hotels',
            icon:<Icon name='home' size={25} color={COLORS.black}/>,
            onClick:()=>{navigation.navigate('Launch')}
        },
        {
            title:"Terms and Conditions",
            icon:<Icon2 name='book-open' size={25} color={COLORS.black}/>,
            onClick:()=>{setShowTerms(true)}
        },
        {
            title:"Privacy",
            icon:<Icon2 name='lock' size={25} color={COLORS.black}/>,
            onClick:()=>{setShowPrivacy(true)}
        },
        // {
        //     title:"Get help with a safety issue",
        //     icon:<Icon2 name='clipboard' size={25} color={COLORS.black}/>,
        //     onClick:()=>{}
        // },
        // {
        //     title:"Explore hosting resources",
        //     icon:<Icon3 name='document-text-outline' size={25} color={COLORS.black}/>,
        //     onClick:()=>{}
        // },
        // {
        //     title:"Contact with Hosts near you",
        //     icon:<Icon4 name='groups' size={25} color={COLORS.black}/>,
        //     onClick:()=>{}
        // },
        // {
        //     title:"Give us feedback",
        //     icon:<Icon name='edit' size={23} color={COLORS.black}/>,
        //     onClick:()=>{}
        // },
        // {
        //     title:"Refer a Host",
        //     icon:<Icon4 name='group' size={25} color={COLORS.black}/>,
        //     onClick:()=>{}
        // },
    ]
    const dispatch=useDispatch()
    const logout=()=>{
        // dispatch(setActor({
        //     backendActor:backend,
        //     userActor:User,
        //     hotelActor:Hotel
        // }))
        // dispatch(setUser({}))
        // dispatch(setHotels([]))
        // dispatch(setPrinciple(''))
        // navigation.navigate('Launch')
        NativeModules.DevSettings.reload();
    }

  return (
    <ScrollView contentContainerStyle={styles.view}>
      <Text style={styles.title}>Menu</Text>
      {/* <Text style={styles.Btext}>Get Early Access</Text> */}
      <Text style={styles.subtitle}>Hosting</Text> 
      {
        hostingItems.map((item,index)=>(
            <MenuItem item={item} key={index}/>
        ))
      }
      <View style={styles.line} />
      <Text style={styles.subtitle}>Account</Text>  
      {
        accountItems.map((item,index)=>(
            <MenuItem item={item} key={index}/>
        ))
      }
      <TouchableOpacity style={[styles.btn,{marginTop:45}]} onPress={()=>navigation.navigate('Launch')}>
        <Text style={[styles.btnText,{color:COLORS.black}]}>Switch to travelling</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn,{backgroundColor:COLORS.black}]} onPress={logout}>
        <Text style={[styles.btnText,{color:'white'}]}>Logout</Text>
      </TouchableOpacity>
      <Modal visible={showTerms} onRequestClose={()=>setShowTerms(false)}>
        <Terms setTermsPage={setShowTerms}/>
      </Modal>
      <Modal visible={showPrivacy} onRequestClose={()=>setShowPrivacy(false)}>
        <Privacy setPrivacyPage={setShowPrivacy}/>
      </Modal>
    </ScrollView>
  )
}

export default MenuPage

const styles = StyleSheet.create({
    view:{
        display:'flex',
        flexDirection:'column',
        alignItems:'flex-start',
        paddingVertical:30,
        backgroundColor: COLORS.newBG
    },
    title:{
        fontSize:SIZES.medxLarge,
        color:'black',
        fontWeight:'500',
        marginLeft:'7.5%',
        marginBottom:40
    },
    Btext:{
        fontSize:SIZES.medium,
        color:'black',
        fontWeight:'800',
        marginLeft:'7.5%',
        marginVertical:20
    },
    subtitle:{
        fontSize:SIZES.large,
        color:COLORS.textLightGrey,
        fontWeight:'500',
        marginLeft:'7.5%'
    },
    line:{
        height:1,
        backgroundColor:COLORS.textLightGrey,
        opacity:0.1,
        width:'100%',
        marginVertical:20
    },
    btn:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        width:'90%',
        marginLeft:'5%',
        borderRadius:12,
        paddingVertical:16,
        borderColor:COLORS.black,
        borderWidth:1,
        marginTop:10
    },
    btnText:{
        fontSize:SIZES.preMedium,
        fontWeight:'bold'
    }
})