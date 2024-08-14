import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ChatHeader from './ChatHeader';
import Query from './Query';
import TypingField from './TypingField';
import {useSelector} from 'react-redux';
import {COLORS} from '../../../../../constants/themes';
import {Principal} from '@dfinity/principal';

const MainChat = ({setSupportChatPage}) => {
  console.log('Support Chat Page');
  const {principle} = useSelector(state => state.principleReducer);

  const userPrincipal = Principal.fromText(principle);

  const [message, setMessage] = useState('');
  const [queries, setQueries] = useState([]);
  const {actors} = useSelector(state => state.actorReducer);
  const [loading, setLoading] = useState(false);

  const sendChatMessage = async () => {
    console.log(actors.supportActor);

    if (!message) {
      return;
    }

    try {
      setLoading(true);
      let resp = await actors?.supportActor?.sendMessage(message, []);
      console.log(resp);
      setLoading(false);
      setMessage('');
      getPreviousQueries();
    } catch (err) {
      console.log(err);
    }

    //   .then(res => {
    //     console.log(res);
    //     setLoading(false);
    //     setMessage('');
    //     getPreviousQueries();
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     setLoading(false);
    //     setMessage('');
    //   });
  };
  const getPreviousQueries = async () => {
    try {
      setLoading(true);
      let supportRes = await actors?.supportActor.getAllUserMessages(
        userPrincipal,
      );
      console.log(supportRes.ok, typeof supportRes.ok);
      //   supportRes.ok.reverse();
      setQueries(supportRes.ok);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPreviousQueries();
  }, []);

  return (
    <View style={styles.view}>
      <ChatHeader setSupportChatPage={setSupportChatPage} />
      <FlatList
        contentContainerStyle={styles.list}
        data={queries}
        renderItem={item => <Query item={item?.item} />}
      />
      <TypingField
        setMessage={setMessage}
        message={message}
        sendMessage={sendChatMessage}
      />
      <ActivityIndicator animating={loading} size={40} style={styles.loader} />
    </View>
  );
};

export default MainChat;

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.newBG,
  },
  list: {
    paddingBottom: 90,
    marginTop: 30,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
  },
  loader: {
    position: 'absolute',
    top: '45%',
    left: '45%',
  },
});
