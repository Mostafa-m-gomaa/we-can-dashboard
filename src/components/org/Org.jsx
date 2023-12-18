import './org.css'
import React from 'react'
import { useContext, useEffect } from 'react'
import { useState } from 'react';
import { AppContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';


const Org = () => {
  const {route ,setLoader ,filesRoute}=useContext(AppContext)
  const [coords,setCoords]=useState([])
  const param =useParams()
  const [showConfirm ,setShowConfirm]=useState(false)
  const [organizationId,setOrganizationId]=useState("")
  const [refresh ,setRefresh]=useState(false)
  const deleteButton =(id)=>{
    setShowConfirm(true)
    setOrganizationId(id)
  }
  
  const deleteUser =()=>{
    setLoader(true)
    setShowConfirm(false)
    fetch(`${route}/organizations/removeCoordinator/${organizationId}`,{
      method :"PUT" ,
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
    fetch(`${route}/organizations/${param.id}`,{
        headers:{
            "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
        }
    })
    .then(res=>res.json())
    .then(data=>{
        console.log(data.data.coordiantors)
        console.log(data)
      if(data.data.coordiantors){
        setCoords(data.data.coordiantors)
      }
    })
  },[refresh])
  return (
   <div className="org">
      {showConfirm ?   <div className="confirm">
    <div>هل انت متاكد انك تريد حذف هذا ؟</div>
    <div className="btns">
      <button onClick={deleteUser}  className='yes' >Yes</button>
      <button onClick={() => setShowConfirm(false)} className='no'>No</button>
    </div>
  </div> :null}
    <div className="container">
      <div className="coords">
        <h2>بيانات المنظمين</h2>
        <div className="in-coords">
          {coords.map((item,index)=>{
            return(
              <div className="coord" key={index}>
                <h3>{item.name}</h3>
                <p>{item.email}</p>
                <button className='delete' onClick={() => deleteButton(item._id)}>حذف</button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
   </div>
  )
}

export default Org