import {
  Dimensions,
  Image,
  Modal,
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Line from './Line';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Feather';
import {COLORS, SIZES} from '../../../../../constants/themes';
import {images} from '../../../../../constants';
import RentSpaceCard from './RentSpaceCard';
import ProfileSection from './ProfileSection';
import Icon3 from 'react-native-vector-icons/SimpleLineIcons';
import Icon4 from 'react-native-vector-icons/FontAwesome6';
import Icon5 from 'react-native-vector-icons/MaterialIcons';
import Icon6 from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {setActor} from '../../../../../redux/actor/actions';
import {setUser} from '../../../../../redux/users/actions';
import {setHotels} from '../../../../../redux/hotels/actions';
import {setPrinciple} from '../../../../../redux/principle/actions';
import {backend} from '../../../../../declarations/backend';
import { User } from '../../../../../declarations/User';
import { Hotel } from '../../../../../declarations/Hotel';
import UserDetailDemo from '../Modals/UserDetailDemo';
import Report from '../Report/Report';
import Feedback from '../Feedback/Feedback';
import MainChat from '../SupportChat/MainChat';
import Privacy from '../Privacy/Privacy';
import Terms from '../TermAndConditions/Terms';
import Faq from '../Faq/Faq';
import {Dialog, ALERT_TYPE} from 'react-native-alert-notification';
import Loading from '../../Loading';

const MainProfile = ({navigation}) => {
  const {user} = useSelector(state => state.userReducer);
  const {actors} = useSelector(state => state.actorReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [reportPage, setReportPage] = useState(false);
  const [feedbackPage, setFeedbackPage] = useState(false);
  const [supportChatPage, setSupportChatPage] = useState(false);
  //below are the states for the new pages
  const [privacyPage, setPrivacyPage] = useState(false);
  const [FAQPage, setFAQPage] = useState(false);
  const [termsPage, setTermsPage] = useState(false);

  const logout = () => {
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
  };

  const getHotelList = async () => {
    await actors.hotelActor
      .getHotelId()
      .then(res => {
        console.log(res);
        dispatch(setHotels(res));
      })
      .catch(err => {
        console.log(err);
        setNoListing(true);
        dispatch(setHotels([]));
      });
  };

  useEffect(() => {
    // getHotelList()
    console.log(user);
  }, []);

  const makeHost = async () => {
    setLoading(true);
    console.log('You are host now');

    // userID : Principal;
    // firstName : Text;
    // lastName : Text;
    // dob : Text;
    // userEmail : Text;
    // userRole : Text;
    // userImage : Text;
    // userGovID : Text;
    // govIDLink : Text;
    // isHost : Bool;
    // isVerified : Bool;
    // agreementStatus : Bool;
    // createdAt : Text;

    const userData = {
      userID: user?.userID,
      firstName: user?.firstName,
      lastName: user?.lastName,
      dob: user?.dob,
      userEmail: user?.userEmail,
      userRole: 'Host',
      userImage: user?.userImage != '' ? user?.userImage : 'img',
      userGovID:
        user?.userGovID == '' || user?.userGovID == null ? '' : user?.userGovID,
      govIDLink:
        user?.govIDLink == '' || user?.govIDLink == null ? '' : user?.govIDLink,
      isHost: true,
      isVerified: user?.isVerified,
      agreementStatus: user?.agreementStatus,
      createdAt: user?.createdAt,
    };

    console.log(userData);

    await actors.userActor
      .updateUserDetails(userData)
      .then(async res => {
        if (res?.ok == undefined) {
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: res?.err,
            button: 'OK',
          });
          return;
        }
        console.log(res);

        setLoading(false);
        // alert('You are a host now!')
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'SUCCESS',
          textBody: 'You are a host now!',
          button: 'OK',
        });
        await actors.userActor
          ?.getuserDetails()
          .then(res => {
            console.log(res?.ok);
            dispatch(setUser(res?.ok));
          })
          .then(() => {
            getHotelList();
          })
          .catch(err => {
            setLoading(false);
            // alert(err)
            Dialog.show({
              type: ALERT_TYPE.DANGER,
              title: 'ERROR',
              textBody: err,
              button: 'OK',
            });
            console.log(err);
          });
      })
      .catch(err => {
        setLoading(false);
        // alert(err)
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'ERROR',
          textBody: err,
          button: 'OK',
        });
        console.log(err);
      });

    // console.log({
    //   ...user,
    //   userRole: 'Host',
    //   isHost: true,
    //   userImage: user?.userImage != '' ? user?.userImage : 'img',
    //   userGovID:
    //     user?.userGovID == '' || user?.userGovID == null
    //       ? 'nothing'
    //       : user?.userGovID,
    // });

    // await actors.userActor
    //   ?.updateUserInfo({
    //     ...user,
    //     userRole: 'Host',
    //     isHost: true,
    //     userImage: user?.userImage != '' ? user?.userImage : 'img',
    //     userGovID:
    //       user?.userGovID == '' || user?.userGovID == null
    //         ? 'nothing'
    //         : user?.userGovID,
    //     agreementStatus: user?.agreementStatus,
    //   })
    //   .then(async res => {
    //     if (res?.ok == undefined) {
    //       Dialog.show({
    //         type: ALERT_TYPE.DANGER,
    //         title: 'Error',
    //         textBody: res?.err,
    //         button: 'OK',
    //       });
    //       return;
    //     }
    //     console.log(res);

    //     setLoading(false);
    //     // alert('You are a host now!')
    //     Dialog.show({
    //       type: ALERT_TYPE.SUCCESS,
    //       title: 'SUCCESS',
    //       textBody: 'You are a host now!',
    //       button: 'OK',
    //     });
    //     await actors.userActor
    //       ?.getUserInfo()
    //       .then(res => {
    //         console.log(res?.ok);
    //         dispatch(setUser(res?.ok));
    //       })
    //       .then(() => {
    //         getHotelList();
    //       })
    //       .catch(err => {
    //         setLoading(false);
    //         // alert(err)
    //         Dialog.show({
    //           type: ALERT_TYPE.DANGER,
    //           title: 'ERROR',
    //           textBody: err,
    //           button: 'OK',
    //         });
    //         console.log(err);
    //       });
    //   })
    //   .catch(err => {
    //     setLoading(false);
    //     // alert(err)
    //     Dialog.show({
    //       type: ALERT_TYPE.DANGER,
    //       title: 'ERROR',
    //       textBody: err,
    //       button: 'OK',
    //     });
    //     console.log(err);
    //   });
  };

  const settingsList = [
    {
      text: 'Personal Information',
      onClick: () => {
        setShowDetails(true);
      },
      icon: <Icon4 name="user" color={COLORS.black} size={20} />,
    },
    // {
    //   text:"Payments",
    //   onClick:()=>{},
    //   icon:<Icon5 name='payments'color={COLORS.black} size={20}/>
    // },
    // {
    //   text:"Notification",
    //   onClick:()=>{},
    //   icon:<Icon2 name='bell'color={COLORS.black} size={20}/>
    // },
    {
      text: 'Privacy',
      onClick: () => {
        setPrivacyPage(true);
      },
      icon: <Icon2 name="lock" color={COLORS.black} size={20} />,
    },
  ];

  const hostingList =
    user?.isHost == true
      ? [
          {
            text: 'Switch to Hosting',
            onClick: () => {
              navigation.navigate('hostHome');
            },
            icon: <Icon4 name="arrows-rotate" color={COLORS.black} size={20} />,
          },
          {
            text: 'List Your Space',
            onClick: () => {
              navigation.navigate('hostListing');
            },
            icon: (
              <Icon4
                name="house-chimney-medical"
                color={COLORS.black}
                size={20}
              />
            ),
          },
        ]
      : [
          {
            text: 'Become a host',
            onClick: () => {
              makeHost();
            },
            icon: <Icon4 name="arrows-rotate" color={COLORS.black} size={20} />,
          },
        ];

  const supportList = [
    {
      text: 'F&Q',
      onClick: () => {
        setFAQPage(true);
      },
      icon: <Icon3 color={COLORS.black} name="notebook" size={20} />,
    },
    // {
    //   text:"Feedback",
    //   onClick:()=>{setFeedbackPage(true)},
    //   icon:<Icon3 color={COLORS.black} name='pencil' size={20}/>
    // },
    // {
    //   text:"How RentSpace works",
    //   onClick:()=>{},
    //   icon:<Icon2 color={COLORS.black} name='book-open' size={20}/>
    // },
    {
      text: 'Report',
      icon: <Icon6 name="warning" color={COLORS.black} size={20} />,
      onClick: () => setReportPage(true),
    },
    {
      text: 'Support Chat',
      icon: (
        <Icon6
          name="chatbubble-ellipses-outline"
          color={COLORS.black}
          size={20}
        />
      ),
      onClick: () => setSupportChatPage(true),
    },
  ];
  const legalList = [
    {
      text: 'Terms and Conditions',
      onClick: () => {
        setTermsPage(true);
      },
      icon: <Icon2 color={COLORS.black} name="book-open" size={20} />,
    },
  ];

  return (
    <View style={styles.page}>
      {/* <View style={styles.backIconCont}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => {
            navigation.navigate('Launch');
          }}>
          <Icon color={COLORS.black} name="chevron-left" size={25} />
        </TouchableOpacity>
      </View> */}
      <ScrollView style={styles.scrollPart} contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <Text style={styles.heading}>Profile</Text>
          {/* <TouchableOpacity>
            <Icon2 name="bell" color={COLORS.textLightGrey} size={30} />
          </TouchableOpacity> */}
        </View>
        <View style={styles.imgCont}>
          <View style={styles.imgView}>
            <Image
              source={
                user?.userImage == '' || user?.userImage == 'img'
                  ? images.newProfile
                  : {uri: user.userImage}
              }
              style={styles.img}
            />
          </View>
          <Text style={styles.name}>
            {user?.firstName + ' ' + user?.lastName}
          </Text>

          <Text style={styles.email}>{user?.userEmail}</Text>
        </View>
        {/* <RentSpaceCard/> */}
        <ProfileSection heading={''} list={settingsList} />
        <Line />
        <ProfileSection heading={'Hosting'} list={hostingList} />
        <Line />
        <ProfileSection heading={'Support'} list={supportList} />
        <Line />
        <ProfileSection heading={'Legal'} list={legalList} />
        <View style={styles.linkView}>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.linkText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        visible={showDetails}
        animationType="slide"
        onRequestClose={() => setShowDetails(false)}>
        <UserDetailDemo
          navigation={navigation}
          setShowDetails={setShowDetails}
        />
      </Modal>
      <Modal
        visible={reportPage}
        animationType="slide"
        onRequestClose={() => setReportPage(false)}>
        <Report setReportPage={setReportPage} />
      </Modal>
      <Modal
        visible={feedbackPage}
        animationType="slide"
        onRequestClose={() => setFeedbackPage(false)}>
        <Feedback setFeedbackPage={setFeedbackPage} />
      </Modal>
      <Modal
        visible={supportChatPage}
        animationType="slide"
        onRequestClose={() => setSupportChatPage(false)}>
        <MainChat setSupportChatPage={setSupportChatPage} />
      </Modal>
      {/* new UI below */}
      <Modal
        visible={privacyPage}
        animationType="slide"
        onRequestClose={() => setPrivacyPage(false)}>
        <Privacy setPrivacyPage={setPrivacyPage} />
      </Modal>

      <Modal
        visible={FAQPage}
        animationType="slide"
        onRequestClose={() => setFAQPage(false)}>
        <Faq setFAQPage={setFAQPage} />
      </Modal>

      <Modal
        visible={termsPage}
        animationType="slide"
        onRequestClose={() => setTermsPage(false)}>
        <Terms setTermsPage={setTermsPage} />
      </Modal>

      <Modal
      visible={loading} 
      transparent={true}      
      >
        <Loading/>
      </Modal>
    </View>
  );
};

export default MainProfile;

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.newBG,
    minHeight: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
    marginTop: 20,
  },
  heading: {
    fontWeight: '600',
    fontSize: SIZES.xLarge + 2,
    color: 'black',
  },
  backIcon: {
    padding: 2,
  },
  imgCont: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '88%',
  },
  imgView: {
    height: Dimensions.get('screen').width * 0.72,
    width: Dimensions.get('screen').width * 0.72,
    borderRadius: Dimensions.get('screen').width * 0.5,
    elevation: 5,
    shadowColor: '#202020',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
  },
  img: {
    height: Dimensions.get('screen').width * 0.72,
    width: Dimensions.get('screen').width * 0.72,
    borderRadius: Dimensions.get('screen').width * 0.5,
    objectFit: 'fill',
  },
  name: {
    fontWeight: '800',
    fontSize: SIZES.largeMed,
    color: 'black',
    marginTop: 5,
  },
  email: {
    fontWeight: '300',
    fontSize: SIZES.small,
    color: COLORS.textLightGrey,
  },
  scrollPart: {
    width: '100%',
    minHeight: '100%',
  },
  backIconCont: {
    position: 'absolute',
    width: '100%',
    backgroundColor: COLORS.mainGrey,
    zIndex: 10,
  },
  linkText: {
    color: COLORS.textLightGrey,
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: 'bold',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  linkView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '88%',
    paddingTop: 20,
    paddingBottom: 40,
  },
});
