import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, SIZES} from '../../../../../constants/themes';
import {images} from '../../../../../constants';
import ReplyCard from './ReplyCard';
import {Principal} from '@dfinity/principal';
import {useSelector} from 'react-redux';

const CommentCard = ({item, setParent, comRef}) => {
  let newCommentItem = {...item, replies: []};
  console.log('New Comment Card Item', item);

  const reply = () => {
    console.log('Replying');
    setParent(newCommentItem?.userId);
    // Keyboard.emit()
    comRef.current.focus();
    console.log(newCommentItem?.userId);
  };

  const {actors} = useSelector(state => state.actorReducer);
  const [cardUser, setCardUser] = useState({});
  const getUser = async () => {
    try {
      let userResp = await actors?.userActor.getUserByPrincipal(
        Principal.fromText(newCommentItem?.userId),
      );
      console.log('UserResp', userResp);
      setCardUser(userResp.ok);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={styles.card}>
      <Image
        source={
          cardUser?.userProfile == '' ||
          cardUser?.userProfile == 'img' ||
          cardUser == {}
            ? images.sampleProfile2
            : {uri: cardUser?.userImage}
        }
        style={styles.img}
      />
      <View style={styles.textCont}>
        <Text style={styles.headText}>
          {cardUser?.firstName} {cardUser?.lastName} •{' '}
          {newCommentItem.createdAt}
        </Text>
        <Text style={styles.normalText}>{newCommentItem.comment}</Text>
        <TouchableOpacity onPress={reply}>
          <Text style={styles.linkText}>Reply</Text>
        </TouchableOpacity>
        {/* {item?.replies?.length > 0 ? (
          item?.replies.map((reply, index) => {
            return <ReplyCard item={reply} key={index} />;
          })
        ) : (
          <></>
        )} */}
        {newCommentItem?.replies?.length > 0 ? (
          newCommentItem?.replies.map((reply, index) => {
            return <ReplyCard item={reply} key={index} />;
          })
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default CommentCard;

const styles = StyleSheet.create({
  card: {
    width: '85%',
    backgroundColor: 'white',
    marginVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    // zIndex:100
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginRight: '3%',
  },
  textCont: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '90%',
  },
  headText: {
    fontSize: SIZES.small,
    color: COLORS.textLightGrey,
    opacity: 0.7,
    fontWeight: '600',
  },
  normalText: {
    fontSize: SIZES.small,
    color: COLORS.black,
    fontWeight: '300',
  },
  linkText: {
    fontSize: SIZES.small,
    color: COLORS.textLightGrey,
    opacity: 0.7,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
});
