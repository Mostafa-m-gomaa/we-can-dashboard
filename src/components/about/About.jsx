
import './about.css'
import React from 'react'
import { useContext, useEffect } from 'react'
import { useState } from 'react';
import { AppContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
const id ="65759c90c5f194bea18fa5c3"
const About = () => {
    const {route ,setLoader ,filesRoute}=useContext(AppContext)
    const [refresh ,setRefresh]=useState(false)
    const [about,setAbout]=useState("")
  const[whoWeAre,setWhoWeAre]=useState("")

  const handleAdd = async (event) => {
    event.preventDefault();
    setLoader(true)

 
    try {
      const response = await fetch(`${route}/webSiteInfo/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json' ,
          "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({
            whoAreWe : whoWeAre ,
            aboutUs : about
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
        fetch(`${route}/webSiteInfo/${id}`,{
            headers:{
                "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
            }
        })
        .then(res=>res.json())
        .then(data=>{
           
      setAbout(data.data.aboutUs)
      setWhoWeAre(data.data.whoAreWe)
        })
      },[refresh])
  return (
    <div className="about">
        <div className="container">
            <h2>بيانات الموقع</h2>
            <form action="" onSubmit={handleAdd}>
                <label htmlFor="">
                    من نحن
                    <textarea onChange={(e)=>setAbout(e.target.value)} value={about} name="" id="" cols="30" rows="10"></textarea>
                </label>
                <label htmlFor="">
                    عن الشركة
                    <textarea onChange={(e)=>setWhoWeAre(e.target.value)} value={whoWeAre} name="" id="" cols="30" rows="10"></textarea>
                </label>
                <button type="submit">تعديل</button>
            </form>
        </div>
    </div>
  )
}

export default About