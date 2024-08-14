import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {COLORS, SIZES} from '../../../../constants/themes';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import Video from 'react-native-video';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider, BottomSheetModal} from '@gorhom/bottom-sheet';
import Comments from './Comments/Comments';
import {useSelector} from 'react-redux';
import {Principal} from '@dfinity/principal';
import axios from 'axios';
import {nodeBackend} from '../../../../../DevelopmentConfig';
import Geolocation from '@react-native-community/geolocation';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';

const months = [
  'January',
  'Febraury',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ReelCard = ({item, reelIndex}) => {
  console.log('Is liked: ', item?.likedBy.includes(principle));
  const [likeDisabled, setLikeDisabled] = useState(false);
  const {user} = useSelector(state => state.userReducer);
  const {principle} = useSelector(state => state.principleReducer);
  const [liked, setLiked] = useState(item?.likedBy.includes(principle));
  const btmSheetComments = useRef(null);
  const {actors} = useSelector(state => state.actorReducer);
  const [reelComments, setReelComments] = useState([]);
  const [loading, setLoading] = useState(false);
  // const baseURL="https://rentspace.kaifoundry.com"
  // const baseURL = 'http://localhost:5000';
  const baseURL = nodeBackend;

  // console.log("ReelCard Item: ", item.likedBy.length);
  const [reelLikes, setReelLikes] = useState();
  const [distance, setDistance] = useState(0);
  const [coord1, setCoord1] = useState({
    latitude: item.latitude,
    longitude: item.longitude,
  });
  const [coord2, setCoord2] = useState({
    latitude: 0,
    longitude: 0,
  });

  function changeDateFormat(date) {
    const d = new Date(date);
    const month = d.toLocaleString('default', {month: 'short'});
    return `${d.getDate()} ${month}`;
  }

  function haversineDistance(coords1, coords2) {
    const toRadians = degrees => (degrees * Math.PI) / 180;

    const lat1 = coords1.latitude;
    const lon1 = coords1.longitude;
    const lat2 = coords2.latitude;
    const lon2 = coords2.longitude;

    const R = 6371; // Radius of the Earth in kilometers

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    console.log('Distance: ', parseFloat(distance.toFixed(1)));
    return parseFloat(distance.toFixed(1));
  }

  const getCurrentLocation = async () => {
    Geolocation.getCurrentPosition(loc => {
      const coordinates = loc.coords;
      console.log(
        'coordinates : ' + coordinates.latitude + ' ' + coordinates.longitude,
      );
      setCoord2({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
    });
  };

  const openComments = () => {
    if(user?.firstName == undefined){
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Warning',
        textBody: 'Please login to comment on this property',
        button: 'OK',
      });
      return;
    };
    btmSheetComments.current.present();
  };
  const sortCreatedAt = arr => {
    const tempArr = arr;
    tempArr.sort((a, b) => {
      const date1 = new Date(a[1].createdAt);
      const date2 = new Date(b[1].createdAt);
      return date1.getTime() - date2.getTime();
    });
    return tempArr;
  };

  const getComments = async () => {
    setLoading(true);

    // getComments
    const comments = [];

    try {
      let commentResp = await actors?.commentActor?.getComments(
        item?.propertyId,
      );

      console.log('commentGetResp', commentResp);

      let newRes = [];
      // commentResp?.ok.map(r => {
      //   if (r[1].parentCommentId == '') {
      //     newRes.push(r);
      //   }
      // });

      // commentResp?.ok.map(r => {
      //   if (newRes.indexOf(r) == -1) {
      //     newRes.push(r);
      //   }
      // });

      // adding original comments first
      for (let i = 0; i < commentResp?.ok.length; i++) {
        if (commentResp?.ok[i].parentCommentId == '') {
          newRes.push(commentResp?.ok[i]);
        }
      }

      // adding missing comments and check for unique comments
      for (let i = 0; i < commentResp?.ok.length; i++) {
        if (newRes.indexOf(commentResp?.ok[i]) == -1) {
          newRes.push(commentResp?.ok[i]);
        }
      }

      let rootCount = 0;
      let replyCount = 0;
      // newRes = sortCreatedAt(newRes); // gives error [TypeError: Cannot read property 'createdAt' of undefined]
      console.log('nes', newRes);

      for (let i = 0; i < newRes.length; i++) {
        setLoading(true);
        let userResp = await actors?.userActor?.getUserByPrincipal(
          Principal.fromText(newRes[i].userId),
        );

        console.log('userResp : ', userResp);

        const date = new Date(newRes[i].createdAt);
        const dateString = `${date.getDate()} ${
          months[date.getMonth()]
        } ${date.getFullYear()}`;
        const newComment = {
          commentId: newRes[i].commentId,
          comment: newRes[i].comment,
          hotelId: newRes[i].propertyId, // hotelId
          userId: newRes[i].userId,
          parentCommentId: newRes[i].parentCommentId,
          createdAt: dateString,
        };

        if (newComment.parentCommentId == '') {
          comments.push(newComment);
          rootCount += 1;
          // setLoading(false);
          // setReelComments([...comments]);
        } else {
          let index = -1;
          for (let j = 0; j < comments.length; j++) {
            if (comments[j].commentId == newComment.parentCommentId) {
              index = j;
            }
          }
          if (index != -1) {
            comments[index] = {
              ...comments[index],
              replies: [...comments[index].replies, newComment],
            };
            replyCount += 1;
            // setReelComments([...comments]);
            // setLoading(false);
          } else {
            comments.push(newComment);
            // setReelComments([...comments]);
            // setLoading(false);
          }
        }
      }
      setReelComments([...comments]);
      setLoading(false);

      // newRes.map(async r => {
      //   setLoading(true)
      //   let userResp = await actors?.userActor?.getUserByPrincipal(Principal.fromText(r[1].userId));

      //   console.log('userResp : ', userResp);
      //   const date = new Date(r[1].createdAt)
      //   const dateString = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
      //   //     commentId:Text;
      //   //     comment : Text;
      //   //     hotelId : Text;
      //   //     userId : Text;
      //   //     parentCommentId : Text;
      //   //     createdAt : Text;
      //   const newComment = {
      //     commentId : r[0],
      //     comment : r[1].comment,
      //     hotelId : r[1].propertyId, // hotelId
      //     userId : r[1].userId,
      //     parentCommentId : r[1].parentCommentId,
      //     createdAt : dateString,
      //   };
      //   if(newComment.parentCommentId == ''){
      //     comments.push(newComment);
      //     rootCount += 1;
      //     setLoading(false);
      //     setReelComments([...comments]);
      //   } else {
      //     let index = -1;
      //     comments.map(comment => {
      //       if(comment.commentId == newComment.parentCommentId){
      //         index = comments.indexOf(comment);
      //       }
      //     });
      //     if(index != -1){
      //       comments[index] = {
      //         ...comments[index],
      //         replies : [...comments[index].replies, newComment],
      //       };
      //       replyCount += 1;
      //       setReelComments([...comments]);
      //       setLoading(false);
      //     } else {
      //       comments.push(newComment);
      //       setReelComments([...comments]);
      //       setLoading(false);
      //     }
      //   }
      // });
    } catch (err) {
      console.log('err fetching comments : ', err);
      setLoading(false);
    }

    // .then(res => {
    //   let newRes = [];
    //   res.map(r => {
    //     if (r[1].parentCommentId == '') {
    //       newRes.push(r);
    //     }
    //   });
    //   res.map(r => {
    //     if (newRes.indexOf(r) == -1) {
    //       newRes.push(r);
    //     }
    //   });
    //   let rootCount = 0;
    //   let replyCount = 0;
    //   newRes = sortCreatedAt(newRes);
    //   console.log('nes', newRes);
    //   newRes.map(async r => {
    //     setLoading(true);
    //     await actors?.userActor
    //       ?.getUserInfoByPrincipal(Principal.fromText(r[1].userId))
    //       .then(userRes => {
    //         const date = new Date(r[1].createdAt);
    //         const dateString = `${date.getDate()} ${
    //           months[date.getMonth()]
    //         } ${date.getFullYear()}`;
    //         const newComment = {
    //           id: r[0],
    //           user: `${userRes[0].firstName} ${userRes[0].lastName}`,
    //           text: r[1].comment,
    //           date: dateString,
    //           userId: r[1].userId,
    //           hotelId: r[1].hotelId,
    //           parentCommentId: r[1].parentCommentId,
    //           replies: [],
    //         };
    //         if (newComment.parentCommentId == '') {
    //           comments.push(newComment);
    //           rootCount += 1;
    //           setLoading(false);
    //           setReelComments([...comments]);
    //         } else {
    //           let index = -1;
    //           comments.map(comment => {
    //             if (comment.id == newComment.parentCommentId) {
    //               index = comments.indexOf(comment);
    //             }
    //           });
    //           if (index != -1) {
    //             comments[index] = {
    //               ...comments[index],
    //               replies: [...comments[index].replies, newComment],
    //             };
    //             replyCount += 1;
    //             setReelComments([...comments]);
    //             setLoading(false);
    //           } else {
    //             comments.push(newComment);
    //             setReelComments([...comments]);
    //             setLoading(false);
    //           }
    //         }
    //       })
    //       .catch(err => {
    //         console.log(err);
    //         setLoading(false);
    //       });
    //   });
    //   console.log(comments.length, rootCount, replyCount);
    //   return comments;
    // })
    // .catch(err => {
    //   console.log('err fetching comments : ', err);
    //   setLoading(false);
    // });
  };

  // this --------------------------------------
  const updateLike = async () => {
    if (likeDisabled || user?.firstName == undefined) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Warning',
        textBody: 'Please login to like this property',
        button: 'OK',
      });
      return;
    }
    setLiked(!liked);
    setLikeDisabled(true);
    // propertyId, userPrincipal
    await axios
      .put(`${baseURL}/api/v1/property/updateLikes`, {
        propertyId: item?.propertyId,
        userPrincipal: principle,
      })
      .then(res => {
        console.log('updated like : ', res.data);
        console.log('includes principal : ', item?.likedBy.includes(principle));
        // setLiked(res.data.likedBy.includes(principle));
        setReelLikes(res.data.likes);
        setLikeDisabled(false);
      })
      .catch(err => {
        setLikeDisabled(false);
        console.log('error updating like : ', err);
      });
  };

  useEffect(() => {
    getCurrentLocation();
    // console.log('distance : ', haversineDistance(coord1, coord2));
    const dist = haversineDistance(coord1, coord2);
    setDistance(dist);
  }, []);

  useEffect(() => {
    setLiked(item?.likedBy.includes(principle));
  }, [reelIndex]);

  return (
    <View style={styles.reel}>
      <Video
        source={{uri: item?.videoList[0]}}
        resizeMode="cover"
        pause={false}
        style={styles.bg}
        repeat={true}
      />
      <View style={styles.iconCont}>
        <TouchableOpacity
          style={styles.icon}
          // disabled={likeDisabled || user?.firstName == undefined}
          onPress={updateLike}>
          {liked ? (
            <Icon name="heart" color={'red'} size={25} />
          ) : (
            <Icon name="hearto" color={COLORS.black} size={25} />
          )}
          <Text style={{color: COLORS.black, fontSize: SIZES.small}}>
            {reelLikes}
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          disabled={user?.firstName == undefined}
          style={styles.icon}
          onPress={() => {
            getComments();
            console.log('liked by ', item?.likedBy.includes(principle));
          }}>
          <Icon name="plus" color={COLORS.black} size={25} />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.icon}
          onPress={openComments}
          // disabled={user?.firstName == undefined}
          >
          <Icon2
            name="chatbubble-ellipses-outline"
            color={COLORS.black}
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bigIcon}
          disabled={user?.firstName == undefined}>
          <Icon3 name="film" color={COLORS.white} size={22} />
        </TouchableOpacity>
      </View>
      <View style={styles.infoCont}>
        <Text style={styles.infoTitle}>{item?.propertyName}</Text>
        {/* <Text style={styles.infoText}>{distance} kilometers away</Text> */}
        <Text style={styles.infoText}>
          {changeDateFormat(item?.availableFrom) +
            ' - ' +
            changeDateFormat(item?.availableTill)}
        </Text>
        {/* <Text style={styles.infoText}>
          <Text style={{fontWeight: 'bold'}}>${item?.price}</Text> night
        </Text> */}
      </View>
      <BottomSheetModal ref={btmSheetComments} index={0} snapPoints={['95%']}>
        <Comments
          id={item?.propertyId}
          comments={reelComments}
          getComments={getComments}
          loading={loading}
          setLoading={setLoading}
        />
      </BottomSheetModal>
      <ActivityIndicator
        animating={true}
        color={COLORS.black}
        style={styles.loader}
        size={40}
      />
    </View>
  );
};

export default ReelCard;

const styles = StyleSheet.create({
  reel: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: COLORS.newBG,
  },
  iconCont: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // justifyContent: 'space-between',
    gap: 15,
    height: '25%',
    width: 50,
    position: 'absolute',
    bottom: '10%',
    right: '3%',
    zIndex: 10,
  },
  infoCont: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'absolute',
    bottom: '10%',
    left: '8%',
    padding: 5,
    zIndex: 5,
  },
  infoTitle: {
    color: COLORS.black,
    fontSize: SIZES.large - 1,
    fontWeight: '500',
    marginBottom: 10,
  },
  infoText: {
    color: COLORS.black,
    fontSize: SIZES.preMedium,
    fontWeight: '300',
    marginBottom: 1,
  },
  icon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 30,
    zIndex: 5,
  },
  bigIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: COLORS.black,
    marginVertical: 15,
    zIndex: 5,
  },
  bg: {
    width: '100%',
    height: '100%',
    // objectFit:'cover',
    zIndex: 5,
  },
  loader: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    zIndex: 0,
  },
});
