import  '../users/users.css'
import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { AppContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';



const CoordStudents = () => {

    const {route ,setLoader ,filesRoute}=useContext(AppContext)
    const [refresh ,setRefresh]=useState(false)
    const [users,setUsers]=useState([])
    const [showConfirm ,setShowConfirm]=useState(false)
    const [userId,setUserId]=useState("")
    const [keysArr,setKeysArr]=useState([])
    const [showUsers,setShowUsers]=useState(false)


      useEffect(()=>{
        fetch(`${route}/organizations/getOrgStudents`,{
            headers:{
                "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
            }
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.users){
                setUsers(data.users)
            }
         
        })
      },[])
  return (
<div className="users">
    <div className="container">
<button onClick={()=>setShowUsers(true)}>عرض الطلاب</button>
{showUsers ?<div className="all-users">
  <div onClick={()=>setShowUsers(false)} className="close">X</div>
    <h1>كل الاعضاء</h1>
    <div className="in-all-users">
      

<table className="users-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Code</th>
      <th>Take Quiz</th>
      <th>Allowed Keys</th>
      
    </tr>
  </thead>
  <tbody>
    {users.map((user, index) => (
      <tr key={index}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.code}</td>
        <td>{user.quizTaken ? "نعم" : "لا"}</td>
        <td className='key-found'> 
          {user.allowed_keys.length === 0 ? (
            "لا يوجد مفاتيح"
          ) : (
            <ul className='in-key-found' >
              {user.allowed_keys.map((key, keyIndex) => (
                <li key={keyIndex}>{key.name}</li>
              ))}
            </ul>
          )}
        </td>
 
      </tr>
    ))}
  </tbody>
</table>
    </div>
</div> :null}
    </div>
</div>
  )
}

export default CoordStudents


 
    