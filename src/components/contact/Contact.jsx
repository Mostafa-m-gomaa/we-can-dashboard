
// import '..//about.css'
import '../about/about.css'
import React from 'react'
import { useContext, useEffect } from 'react'
import { useState } from 'react';
import { AppContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
const id ="65c68060ccef46433ee10464"
const Contact = () => {
    const {route ,setLoader ,filesRoute}=useContext(AppContext)
    const [refresh ,setRefresh]=useState(false)
    const [about,setAbout]=useState("")
    const [phone,setPhone]=useState("")
    const [address,setAddress]=useState("")
    const [facebook,setFacebook]=useState("")
    const [whatsApp,setWhatsApp]=useState("")
    const [linkedIn,setLinkedIn]=useState("")
    const [instagram,setInstagram]=useState("")

  const[whoWeAre,setWhoWeAre]=useState("")

  const handleAdd = async (event) => {
    event.preventDefault();
    setLoader(true)

 
    try {
      const response = await fetch(`${route}/contactUs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json' ,
          "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({
            phone : phone ,
            address : address,
            facebook : facebook,
            whatsApp : whatsApp,
            linkedIn : linkedIn,
            instagram : instagram
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
    toast.error(response.errors[0].msg)
    
      }
    } catch (error) {
      console.error(error);
    
    }
  };


    useEffect(()=>{
        fetch(`${route}/contactUs`,{
            headers:{
                "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
            }
        })
        .then(res=>res.json())
        .then(data=>{
     console.log(data)
     if(data.data){
setAddress(data.data[0].address)
setPhone(data.data[0].phone)
setFacebook(data.data[0].facebook)
setWhatsApp(data.data[0].whatsApp)
setLinkedIn(data.data[0].linkedIn)
setInstagram(data.data[0].instagram)

     }
        })
      },[refresh])
  return (
    <div className="about">
        <div className="container">
            <h2>بيانات الموقع</h2>
            <form action="" onSubmit={handleAdd}>
                <label htmlFor="">
                   رقم الهاتف 
                   <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} />
                </label>
                <label htmlFor="">
                  العنوان
                   <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} />
                </label>
                <label htmlFor="">

فيسبوك              
     <input type="text" value={facebook} onChange={(e)=>setFacebook(e.target.value)}/>
                </label>
                <label htmlFor="">
                واتس اب
                   <input type="text" value={whatsApp} onChange={(e)=>setWhatsApp(e.target.value)} />
                </label>
                <label htmlFor="">
                  لينكد ان
                   <input type="text" value={linkedIn} onChange={(e)=>setLinkedIn(e.target.value)} />
                </label>
                <label htmlFor="">
                    انستاجرام
                   <input type="text" value={instagram} onChange={(e)=>setInstagram(e.target.value)} />
                </label>
        
                <button type="submit">تعديل</button>
            </form>
        </div>
    </div>
  )
}

export default Contact