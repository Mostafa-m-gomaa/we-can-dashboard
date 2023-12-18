import React, { useContext, useState } from 'react'
import './login.css'
import { AppContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const {route ,setLogin ,setLoader ,setCoordLogin}=useContext(AppContext)
    const [email ,setEmail]=useState("")
    const [pass ,setPass]=useState("")
    const [type,setType] = useState('');
    const history=useNavigate()

    const handleEmail =(e)=>{
        setEmail(e.target.value)
    }

    const handlePass =(e)=>{
        setPass(e.target.value)
    }
    const handleLogin = async (event) => {
        event.preventDefault();
        setLoader(true)
      
      
 const obj ={
          email : email ,
          password : pass
 }
        if(type !== ""){
        obj.type = type
        }
        try {
          const response = await fetch(`${route}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
          })
          .then(res=>res.json())
          console.log(response)
          setLoader(false)
          if (response.token && response.data.role === "admin" ) {
           sessionStorage.setItem("token",response.token)
           sessionStorage.setItem("login",true)
           setLogin(true)
           history("المستخدمين")
          } 
          else if(response.token && response.data.role === "coordinator" ) {
            sessionStorage.setItem("token",response.token)
            sessionStorage.setItem("coordLogin",true)
            setCoordLogin(true)
            history("my-student")
           }

          
          else {
        toast.error("هناك خطأ بكلمة السر أو الأيميل حاول مرة أخري")
        
          }
        } catch (error) {
          console.error(error);
        
        }
      };

  return (
   <div className="login">
    <div className="container">
    <form class="form" onSubmit={handleLogin}>
تسجيل الدخول
    <input value={email} onChange={handleEmail} type="email" class="input" placeholder="Email" />
    <input value={pass} onChange={handlePass} type="password" class="input" placeholder="Password" /> 
    <select name="" id="" onChange={(e)=>setType(e.target.value)}>
      <option value="">role</option>
      <option value="">admin</option>
      <option value="coordinator">coordinator</option>
    </select>
    <button type='submit'>Submit</button>
</form>
    </div>
   </div>
  )
}

export default Login
