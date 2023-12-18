import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { AppContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './raters.css'
import AOS from 'aos';
import 'aos/dist/aos.css';

const Raters = () => {
    const param =useParams()
    const [data1,setData1]=useState([])
    const [data2,setData2]=useState([])
    const {route ,setLoader ,filesRoute}=useContext(AppContext)
    const [refresh ,setRefresh]=useState(false)
    const [showEdit,setShowEdit]=useState(false)
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [raterId,setRaterId]=useState("")
    const [id1,setId1]=useState("")
    const [id2,setId2]=useState("")


    const clickEdit =(id)=>{
        setRaterId(id)
        setShowEdit(true)
    }

    const handleAdd = async (event) => {
        event.preventDefault();
        setLoader(true)
        const obj ={
            raterId : raterId
        }
        if(name !== ""){
            obj.newName=name
        }
        if(email !== ""){
            obj.newEmail=email
        }
        try {
          const response = await fetch(`${route}/answer/updateRaterEmail`, {
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
          if (response.status === "success") {
          toast.success("تمت الأضافة")
          setRefresh(!refresh)
          setShowEdit(false)
          }
           else {
        // toast.error("sayed")
        toast.error(response.errors[0].msg)
        
          }
        } catch (error) {
          console.error(error);
        
        }
      };

      const sendNotify =(docId , raterEmail)=>{
        
        setLoader(true)
        fetch(`${route}/answer/SendEmailToRater`,{
            method:"PUT",
            headers:{
                "Authorization" :`Bearer ${sessionStorage.getItem("token")}`,
                "Content-Type":"application/json"
            } ,
            body:JSON.stringify({
                userId:param.id,
                docId : docId ,
                raterEmail : raterEmail
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setLoader(false)
            console.log(data)
            if(data.status === "success"){
                toast.success(data.msg)
            }
        })
      }
    useEffect(()=>{
        fetch(`${route}/answer/getAnswerEmails/${param.id}`,{
            headers:{
                "Authorization" :`Bearer ${sessionStorage.getItem("token")}`,
                
            }
        })
        .then(res=>res.json())
        .then(data=>{
           
            setData1(data.data1)
            setId1(data.docId1)
            setId2(data.docId2)
            setData2(data.data2)
        })
      },[refresh])
  return (
    <div className="raters">
        {showEdit ?         <div data-aos="flip-left"
     data-aos-easing="ease-out-cubic"
     data-aos-duration="2000" className="edit">
            <form action="" onSubmit={handleAdd}>
                <label htmlFor="">
                    الاسم
                    <input type="text" onChange={(e)=>setName(e.target.value)} />
                </label>
                <label htmlFor="">
                    الايميل
                    <input type="email" onChange={(e)=>setEmail(e.target.value)} />
                </label>
                <button  type='submit'>تم</button>
            </form>
        </div>: null}

        <div className="container">
        <h2>المقيمين في القبلي</h2>
        <div className="in-raters">
            {data1.map((item,index)=>{
                return(
                    <div className="rater" key={index}>
                        <p>{item.name}</p>
                        <p>{item.email}</p>
                        <button onClick={()=>clickEdit(item.raterId)}>تعديل</button>
                        <button onClick={()=>sendNotify(id1,item.email)}>ارسال تنبه</button>
                    </div>
                )
            })}
        </div>
        <h2>المقيمين في البعدي</h2>
        <div className="in-raters">
            {data2.map((item,index)=>{
                return(
                    <div className="rater" key={index}>
                        <p>{item.name}</p>
                        <p>{item.email}</p>
                        <button onClick={()=>clickEdit(item.raterId)}>تعديل</button>
                        <button onClick={()=>sendNotify(id2,item.email)}>ارسال تنبه</button>
                    </div>
                )
            })}
        </div>
        </div>
    </div>
  )
}

export default Raters