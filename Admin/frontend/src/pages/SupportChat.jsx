import React, { useState } from 'react'
import {useNavigate } from 'react-router-dom'
import Header from '../components/Reusables/header/Header'
import '../components/supportChat/supportChat.css'
import ChatList from '../components/supportChat/ChatList'
import Chat from '../components/supportChat/chat/Chat'


const SupportChat = () => {
  const nav=useNavigate()
  const [chat,setChat]=useState("")
  return (
    <div className='page'>
      <Header title={'Support Chat'}/>
      <div className="chat-main-cont">
          <ChatList currChat={chat} setChat={setChat}/>
          {
            chat==""?
            <></>
            :<Chat user={chat}/>
          }
      </div>
    </div>
  )
}

export default SupportChat