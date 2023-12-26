import  './users.css'
import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { AppContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import ReactToExcel from 'react-html-table-to-excel';
import { saveAs } from 'file-saver';





const Users = () => {
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [passwordConfirm,setPasswordConfirm]=useState("")
    const {route ,setLoader ,filesRoute}=useContext(AppContext)
    const [refresh ,setRefresh]=useState(false)
    const [users,setUsers]=useState([])
    const [showConfirm ,setShowConfirm]=useState(false)
    const [userId,setUserId]=useState("")
    const [organizations,setOrganizations]=useState([])
    const [keys,setKeys]=useState([])
    const [orgId,setOrgId]=useState("")
    const [keysArr,setKeysArr]=useState([])
    const [showUsers,setShowUsers]=useState(false)
    const [phone,setPhone]=useState("")

    const handleAdd = async (event) => {
        event.preventDefault();
        setLoader(true)
        try {
          const response = await fetch(`${route}/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json' ,
              "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify({
                name:name,
              email : email ,
              phone : phone ,
              organization : orgId ,
              allowed_keys : keysArr
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
      const deleteButton =(id)=>{
        setShowConfirm(true)
        setUserId(id)
      }

      const deleteUser =()=>{
        setLoader(true)
        setShowConfirm(false)
        fetch(`${route}/users/${userId}`,{
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
      const takeAgain =(id)=>{
        setLoader(true)
        fetch(`${route}/users/availUserToTakeQuiz/${id}`,{
          method :"PUT" ,
          headers :{
            "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
          }
        }).then(res=>res.json())
        .then(data => {
            console.log(data)
            setLoader(false)
            if(data.status ==="success"){
                toast.success(data.msg)
            }
            if(data.status === "faild"){
                toast.error(data.msg)
                
            }

        })
      }


      useEffect(()=>{
        fetch(`${route}/users`,{
            headers:{
                "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
            }
        })
        .then(res=>res.json())
        .then(data=>{
          if(data.data){
            setUsers(data.data)
            console.log(data.data)
          }
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
{showConfirm ?   <div className="confirm">
    <div>هل انت متاكد انك تريد حذف هذا ؟</div>
    <div className="btns">
      <button onClick={deleteUser}  className='yes' >Yes</button>
      <button onClick={() => setShowConfirm(false)} className='no'>No</button>
    </div>
  </div> :null}
    <div className="container">
<div className="add">
    <h1>اضف عضو جديد</h1>
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
             رقم الهاتف
              <input  value={phone} onChange={(e)=>setPhone(e.target.value)} type='password' />
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
            <input type="checkbox" name="" id="" onChange={()=>handleKeys(key._id)} />
          </label>
        )
      })}
      </div>
    </div>
            <button type='submit'>أضافة</button>
            <div onClick={()=>setShowUsers(true)} className='show-users'>اظهار جدول المستخدمين</div>
          </form>
</div>
{showUsers ?<div className="all-users">
  <div onClick={()=>setShowUsers(false)} className="close">X</div>
    <h1>كل الاعضاء</h1>
    <ReactToExcel table="table" filename="userSheet" sheet="sheet1" buttonText="export" className="export-button" />
    <div className="in-all-users">
      

<table className="users-table" id='table'>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Code</th>
      <th>Take Quiz</th>
      <th>Organization</th>
      <th>Allowed Keys</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {users.map((user, index) => (
      <tr key={index}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.code}</td>
        <td>{user.quizTaken ? "نعم" : "لا"}</td>
        <td>{user.organization ? user.organization.name : "لا يوجد"}</td>
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
        <td className='actions'>
          {user.role === "user" && (
            <div className="action-cont">

              <Link to={`/rater/${user._id}`}>المقيمين </Link>
              <Link to={`/edit/${user._id}`}>تعديل </Link>
              <button className="delete" onClick={() => deleteButton(user._id)}>
                حذف
              </button>
              <button className="again" onClick={() => takeAgain(user._id)}>
                السماح بالامتحان مرة اخري
              </button>
            </div>
            
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

export default Users


  {/* {users.map((user,index)=>{
            return(
                <div className="user-card" key={index}>
                    {user.role=== "user" ?<div className="in-user-card">

                    <div className="name">name : {user.name}</div>
                    <div className="email">email : {user.email}</div>
                    <div className="code">code : {user.code}</div>
                    <div className="quiz">take quiz : {user.quizTaken ? "نعم" :"لا"}</div>
                    <div className="allowed">
                        <h3>المفاتيح المسموح بها</h3>
                        {user.allowed_keys.length === 0 ? <div className="no-keys">لا يوجد مفاتيح</div>:
                        
                        <div className="in-allowed">
                        {user.allowed_keys.map((key,index)=>{
                            return(
                                <div className="key" key={index}>{key.name}</div>
                            )
                        })}
                    </div>}

                    </div>
                    <Link to={`/edit/${user._id}`} >تعديل او اضافة مفاتيح</Link>
                    <button className='delete' onClick={() => deleteButton(user._id)}>حذف</button>
                    <button className='again' onClick={()=>takeAgain(user._id)} >السماح بالامتحان مرة اخري</button>
                    </div> :<div className="in-user-card">
<h3>Admin</h3>
<div className="name">{user.name}</div>
<div className="email">{user.email}</div>
<button onClick={() => deleteButton(user._id)} className='delete'>حذف</button>

</div> }
                   
                </div>
            )
        })} */}
    