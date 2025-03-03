
import './keys.css'
import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { AppContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Keys = () => {
    const [name,setName]=useState("")
    const {route ,setLoader ,filesRoute}=useContext(AppContext)
    const [refresh ,setRefresh]=useState(false)
    const [keys,setKeys]=useState([])
    const [showConfirm ,setShowConfirm]=useState(false)
    const [keyId,setKeyId]=useState("")

    const deleteButton =(id)=>{
        setShowConfirm(true)
        setKeyId(id)
      }
    const handleAdd = async (event) => {
        event.preventDefault();
        setLoader(true)
        try {
          const response = await fetch(`${route}/keys`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json' ,
              "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify({
                name:name,
     
            })
          })
          .then(res=>res.json())
          console.log(response)
          setLoader(false)
          if (response.data) {
          toast.success("تمت الأضافة")
          setRefresh(!refresh)
          }
           else {
        // toast.error("sayed")
        toast.error(response.message)
        
          }
        } catch (error) {
          console.error(error);
        
        }
      };
      const deleteKey =()=>{
        setLoader(true)
        setShowConfirm(false)
        fetch(`${route}/keys/${keyId}`,{
          method :"DELETE" ,
          headers :{
            "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
          }
        })
        .then(res => {
            setLoader(false)
            console.log(res)
            if(res.ok){
      toast.success("تم الحذف بنجاح")
      setRefresh(!refresh)
            }
            else{
              toast.error("لم يتم الحذف")
            }
        })
     
      }
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
      },[refresh])
  return (
  <div className="keys">
    {showConfirm ?   <div className="confirm">
    <div>هل انت متاكد انك تريد حذف هذا ؟</div>
    <div className="btns">
      <button onClick={deleteKey} className='yes' >Yes</button>
      <button onClick={() => setShowConfirm(false)} className='no'>No</button>
    </div>
  </div> :null}
    <div className="container">
        <div className="add-key">
            <h1>اضافه مفتاح</h1>
            <form action="" onSubmit={handleAdd}>

                <label htmlFor="">
                    العنوان
                    <input value={name} onChange={(e)=>setName(e.target.value)} type="text" />
                </label>
                    <button type='submit'>أضافة</button>
            </form>
        </div>
        <div className="all-keys">
            <h1>كل المفاتيح</h1>
            <div className="in-all-keys">
            {keys.map((key,index)=>{
                return(
                    <div className="key-card" key={index}>
                        {key.name}
                        <div>{key._id}</div>
                        <button onClick={()=>deleteButton(key._id)}>حذف</button>
                    </div>
                )
            })}
            </div>
        </div>
    </div>
  </div>
  )
}

export default Keys
