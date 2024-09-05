import React from 'react'
import './login.css'
import { useAuth } from '../utils/useAuthClient'

const Login = ({setLoggedIn}) => {
  const {login}=useAuth()
    const Login=async()=>{
        // localStorage.setItem("loggedIn",true)
        // setLoggedIn(true)
        await login().then((res)=>{
          console.log(res)
        })
    }
  return (
    <div className='cont'>
        <h1 className='login-h1'>RentSpace Admin Login</h1>
    <div className='main-login-app'>

        <img
            id="logo"
            src="https://media.licdn.com/dms/image/C4E0BAQFQsPdXKehPFQ/company-logo_200_200/0/1643542937852?e=2147483647&v=beta&t=od5rpn805bJNkKcLdPVCo5ViKXBOPgwGeO-5ifNMCmc"
            alt="RentSpace Logo"
          />
          <form onSubmit={(e)=>{
            e.preventDefault()
          }}>
            <button id="login" onClick={Login}>Login with Internet Identity</button>
          </form>
          <br />
          {/* <form>
            <button id="open">Continue to dashboard</button>
          </form> */}
    </div>
    </div>
  )
}

export default Login