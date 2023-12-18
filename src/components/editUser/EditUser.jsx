import  '../users/users.css'
import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { AppContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useParams } from 'react-router-dom';

const EditUsers = () => {
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const {route ,setLoader ,filesRoute}=useContext(AppContext)
    const [refresh ,setRefresh]=useState(false)
    const [users,setUsers]=useState([])
    
    const [organizations,setOrganizations]=useState([])
    const [keys,setKeys]=useState([])
    const [orgId,setOrgId]=useState("")
    const [keysArr,setKeysArr]=useState([])
    const param =useParams()


    const handleAdd = async (event) => {
        event.preventDefault();
        setLoader(true)
        if(email){
          var obj ={
            name:name,
            email : email ,
            organization : orgId ,
            allowed_keys : keysArr
          }  
        }
        else{
            var obj ={
                name:name,
                organization : orgId ,
                allowed_keys : keysArr
            }
        }
        try {
          const response = await fetch(`${route}/users/${param.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json' ,
              "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify(obj)
          })
          .then(res=>res.json())
          console.log(response)
          setLoader(false)
          if (response.data) {
          toast.success("تمت التعديل بنجاح")
          setRefresh(!refresh)
          }
           else {
        // toast.error("sayed")
        toast.error(response.errors[0].msg)
        
          }
        } catch (error) {
          console.error(error);
        
        }
      };
      const handleKeys =(id)=>{
        if (keysArr.includes(id)) {
          setKeysArr(keysArr.filter((item) => item !== id));
        } else {
          setKeysArr([...keysArr, id]);
        }
    
console.log(keysArr)
      }
   

   
      


      useEffect(()=>{
        fetch(`${route}/users/${param.id}`,{
            headers:{
                "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
            }
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data.data)
            setName(data.data.name)
            setOrgId(data.data.organization)
            const arr = data.data.allowed_keys
            const ids = arr.map(obj => obj._id);
            setKeysArr(ids)
          
        })
      },[refresh])

      useEffect(()=>{
        fetch(`${route}/organizations`,{
            headers:{
                "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
            }
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data.data)
          if(data.data){
            setOrganizations(data.data)
          }
        })
      },[])
      useEffect(()=>{
        fetch(`${route}/keys`,{
            headers:{
                "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
            }
        })
        .then(res=>res.json())
        .then(data=>{
          if(data.data){
            setKeys(data.data)
            console.log(data.data)
          }
        })
      },[])
  return (
<div className="users">
    <div className="container">
<div className="add">
    <h1>تعديل</h1>
    <form action="" onSubmit={handleAdd}>
            <label htmlFor="">
              الاسم
              <input value={name} onChange={(e)=>setName(e.target.value)} type='text' />
            </label>
            <label htmlFor="">
              الايميل
              <input value={email}  type='text' onChange={(e)=>setEmail(e.target.value)} />
            </label>
      <label htmlFor="">
        اختر منظمة
        <select name="" id="" onChange={(e)=>setOrgId(e.target.value)}>
          <option value="">اختر منظمة</option>
          {organizations.map((org,index)=>{
            return(
              <option key={index} value={org._id}>{org.name}</option>
            )
          })}
        </select>
      </label>
    <div className="keys">
      اختر المفاتيح
      <div className="in-keys">

      {keys.map((key,index)=>{
        return(
          <label key={index} htmlFor="">
            {key.name}
            <input type="checkbox" checked={keysArr.includes(key._id)} name="" id="" onChange={()=>handleKeys(key._id)} />
          </label>
        )
      })}
      </div>
    </div>
            <button type='submit'>أضافة</button>
          </form>
</div>
    </div>
</div>
  )
}

export default EditUsers
