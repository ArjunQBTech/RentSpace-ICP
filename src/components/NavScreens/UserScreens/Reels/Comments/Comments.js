import {
  ActivityIndicator,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {COLORS, SIZES} from '../../../../../constants/themes';
import {images} from '../../../../../constants';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {FlatList} from 'react-native-gesture-handler';
import CommentCard from './CommentCard';
import {useSelector} from 'react-redux';

const sampleComments = [
  {
    name: 'Alice Johnson',
    date: 'January 2024',
    text: "Your content is absolutely amazing! I love the creativity and effort you put into each video. It's truly inspiring and always brightens my day. Keep up the fantastic work!",
  },
  {
    name: 'Bob Smith',
    date: 'February 2024',
    text: 'Incredible content, seriously! Your videos never fail to impress me. The attention to detail and the uniqueness of your ideas make them stand out. Looking forward to more!',
    replies: [
      {
        name: 'Charlie Davis',
        date: 'March 2024',
        text: "Mesmerizing is an understatement! I'm hooked on your reels. The way you capture moments is exceptional. Can't stop watching. You have a true gift for storytelling!",
      },
      {
        name: 'David Lee',
        date: 'April 2024',
        text: "Your creativity knows no bounds. Love the way you blend artistry and innovation in your videos. Each one feels like a masterpiece. You're making a positive impact!",
      },
    ],
  },
  {
    name: 'Charlie Davis',
    date: 'March 2024',
    text: "Mesmerizing is an understatement! I'm hooked on your reels. The way you capture moments is exceptional. Can't stop watching. You have a true gift for storytelling!",
  },
  {
    name: 'David Lee',
    date: 'April 2024',
    text: "Your creativity knows no bounds. Love the way you blend artistry and innovation in your videos. Each one feels like a masterpiece. You're making a positive impact!",
  },
  {
    name: 'Emma Taylor',
    date: 'May 2024',
    text: "Absolutely stunning! Your content radiates positivity and creativity. It's a joy to watch. Keep spreading the good vibes through your incredible work. Much love! 💖",
  },
  {
    name: 'Frank Miller',
    date: 'June 2024',
    text: 'This made my day! Your ability to captivate audiences is unmatched. The way you express ideas in your videos is truly refreshing. Thank you for sharing your talent!',
  },
  {
    name: 'Grace Wilson',
    date: 'July 2024',
    text: 'How do you come up with such cool ideas? Mind-blown! Your content stands out, and the creativity you bring to each reel is awe-inspiring. Keep up',
  },
];

const Comments = ({id, comments, getComments, loading, setLoading}) => {
  const comRef = useRef();
  const [comment, setComment] = useState('');
  const [parent, setParent] = useState('');
  const {user} = useSelector(state => state.userReducer);
  const {actors} = useSelector(state => state.actorReducer);
  const [refresh, setRefresh] = useState(false);

  const createComment = async () => {
    try {
      if (comment == '') return;
      setComment('');
      setLoading(true);
      Keyboard.dismiss();
      console.log(`adding new comment ${comment} \n with parent : ${parent}`);

      let Finalcomment = {
        message: comment,
        parentCommentId: parent,
      };

      console.log('Comment : ', Finalcomment);
      console.log('ID : ', id);

      let res = await actors?.commentActor?.createComment(id, Finalcomment);

      console.log('Response : ', res);

      getComments();
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      setParent('');
      console.log(parent);
      // comRef.current.clearFocus()
      console.log('keyboard hiding');
    });
    getComments();
  }, []);

  return (
    <View style={styles.sheet}>
      <Text style={styles.title}>Comments</Text>
      <View style={styles.line} />
      <FlatList
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.commentList}
        data={comments}
        renderItem={item => (
          <CommentCard item={item.item} setParent={setParent} comRef={comRef} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.typeCont}>
        <Image
          source={
            user?.userProfile == '' || user?.userProfile == 'img'
              ? images.sampleProfile2
              : {uri: user?.userProfile}
          }
          style={styles.img}
        />
        <TextInput
          value={comment}
          onChangeText={value => setComment(value)}
          style={styles.textInput}
          placeholder="Type your comment Here..."
          placeholderTextColor={COLORS.textLightGrey}
          multiline={true}
          scrollEnabled={true}
          ref={comRef}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={createComment}>
          <Icon name="location-arrow" color={COLORS.textLightGrey} size={30} />
        </TouchableOpacity>
      </View>
      <ActivityIndicator animating={loading} size={40} style={styles.loader} />
    </View>
  );
};

export default Comments;

const styles = StyleSheet.create({
  sheet: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.largeMed,
    color: COLORS.textLightGrey,
    opacity: 0.7,
    marginVertical: 10,
    fontWeight: '600',
  },
  line: {
    width: '100%',
    backgroundColor: COLORS.textLightGrey,
    opacity: 0.4,
    height: 0.7,
  },
  typeCont: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 70,
    elevation: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  img: {
    width: 35,
    height: 35,
    borderRadius: 25,
  },
  textInput: {
    width: '75%',
    backgroundColor: 'white',
    color: COLORS.black,
    height: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.textLightGrey,
    paddingHorizontal: 15,
    color: COLORS.textLightGrey,
    opacity: 0.7,
  },
  sendBtn: {},
  commentList: {
    width: '100%',
    display: 'flex',
    minHeight: '80%',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 100,
    paddingTop: 20,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '45%',
  },
});
