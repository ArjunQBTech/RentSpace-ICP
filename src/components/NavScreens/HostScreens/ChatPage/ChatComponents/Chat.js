import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ChatHeader from './ChatHeader'
import TypingField from './TypingField'
import ChatMessage from './ChatMessage'
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { COLORS } from '../../../../../constants/themes' 

const Chat = ({item,setOpenChat}) => {
  const [messages,setMessages]=useState([])
  const {token}=useSelector(state=>state.chatTokenReducer)
  const {principle}=useSelector(state=>state.principleReducer)
  const [message,setMessage]=useState("")
  const [socket,setSocket]=useState(null)
  const baseUrl="https://rentspace.kaifoundry.com"
  // const baseUrl="http://localhost:5000"

  const pin="bzyut-cxk7l-tkb6p-6kxev-4k2lf-fajro-7biwv-yxlii-ingdb-flzdj-jae"
  // const checkSendMessage=()=>{
  //   const newMessage = {
  //     fromPrincipal: principle,
  //     toPrincipal: pin,
  //     message: "Hi revant this is a test",
  //     privateToken: token
  //   };
  //   socket.emit('sendMessage', JSON.stringify(newMessage));
  //       // setMessages([...messages, newMessage]);
  //       // setMessage('');
  //       console.log("message sent")
  // }

  const sendMessage = () => {
    if (socket && item?.id) {
        const newMessage = {
            fromPrincipal: principle,
            toPrincipal: item?.id,
            message: message,
            privateToken: token
        };

        socket.emit('sendMessage', JSON.stringify(newMessage));
        setMessages([...messages, newMessage]);
        setMessage('');
    }
  };

  const getPreviousMessages=async()=>{

    await axios.post(`${baseUrl}/api/v1/chat/${item?.id}`,{},{headers:{
      "x-principal":principle,
      "x-private-token":token
    }}).then((res)=>{
      console.log("chat res particular : ",res.data.messages)
      setMessages(res.data.messages.reverse())
    }).catch((err)=>{
      console.log(err)
    })
  }
  useEffect(()=>{
    
    console.log("token : ",token,"principal : ",principle)
    getPreviousMessages()
    const newSocket = io(`${baseUrl}`, {
      query: { principal: principle }
     });
     setSocket(newSocket);

    newSocket.on('receiveMessage', (data) => {
      setMessages([...messages,data]);
    });

    
    return () => newSocket.close();

  },[])
  return (
    <View style={styles.view}>
      <ChatHeader name={item?.firstName} status={true} setOpenChat={setOpenChat}/>
      <FlatList contentContainerStyle={styles.list} data={messages} renderItem={(item)=>(
        <ChatMessage item={item.item}/>
      )}/>
      <TypingField setMessages={setMessages} messages={messages} setMessage={setMessage} message={message} sendMessage={sendMessage}/>
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({
    view:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        width:'100%',
        height:'100%',
        backgroundColor:COLORS.mainGrey
    },
    list:{
      paddingBottom:90,
      marginTop:30,
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      width:'90%'
    }
})