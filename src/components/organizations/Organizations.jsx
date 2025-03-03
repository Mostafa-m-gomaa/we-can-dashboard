import React from 'react'
import './organizations.css'
import { useContext, useEffect } from 'react'
import { useState } from 'react';
import { AppContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Organizations = () => {
    const {route ,setLoader ,filesRoute}=useContext(AppContext)
    const [name,setName]=useState("")
    const [image, setImage] = useState(null);
    const [refresh ,setRefresh]=useState(false)
    const [organizations,setOrganizations]=useState([])
    const [showConfirm ,setShowConfirm]=useState(false)
    const [organizationId,setOrganizationId]=useState("")
    const [showAddCoord,setShowAddCoord]=useState(false)
    const [coordName,setCoordName]=useState("")
    const [coordEmail,setCoordEmail]=useState("")
    const [coordPassword,setCoordPassword]=useState("")

    const handleImageChange = (event) => {
        const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      setImage(null);
    }
    };
    const deleteButton =(id)=>{
        setShowConfirm(true)
        setOrganizationId(id)
      }
    const addCoord =(id)=>{
        setShowAddCoord(true)
        setOrganizationId(id)
      }

      const deleteUser =()=>{
        setLoader(true)
        setShowConfirm(false)
        fetch(`${route}/organizations/${organizationId}`,{
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

    const handleAdd = async (event) => {
        event.preventDefault();
        setLoader(true)

        const formData = new FormData();
        formData.append('name', name);
        formData.append('logo', image);
        try {
          const response = await fetch(`${route}/organizations`, {
            method: 'POST',
            headers: {

              "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
            },
            body: formData
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
    const handleAddCoord = async (event) => {
        event.preventDefault();
        setLoader(true)

        // const formData = new FormData();
        // formData.append('name', name);
        // formData.append('email', coordEmail);
        // formData.append('password', coordPassword);
        try {
          const response = await fetch(`${route}/organizations/addCoordiantor/${organizationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
              "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify({ name: coordName ,email:coordEmail ,password:coordPassword })
          })
          .then(res=>res.json())
          console.log(response)
          setLoader(false)
          if (response.status === "success") {
          toast.success("تمت الأضافة")
          setRefresh(!refresh)
          setShowAddCoord(false)
          }
           else {
        // toast.error("sayed")
        toast.error(response.errors[0].msg)
        
          }
        } catch (error) {
          console.error(error);
        
        }
      };

      
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
      },[refresh])
  return (
   <div className="organizations">
    {showConfirm ?   <div className="confirm">
    <div>هل انت متاكد انك تريد حذف هذا ؟</div>
    <div className="btns">
      <button onClick={deleteUser}  className='yes' >Yes</button>
      <button onClick={() => setShowConfirm(false)} className='no'>No</button>
    </div>
  </div> :null}
  {showAddCoord ?   <div data-aos="flip-left"
     data-aos-easing="ease-out-cubic"
     data-aos-duration="2000" className="add-coord">
  <div className="in-add-coord">
    <div className="close" onClick={()=>setShowAddCoord(false)}>x</div>
    <h1>اضف منظم</h1>
    <form action="" onSubmit={handleAddCoord} >
            <label htmlFor="">
              الاسم
              <input onChange={(e)=>setCoordName(e.target.value)} type='text' />
            </label>
            
            <label htmlFor="">
              الايميل
              <input onChange={(e)=>setCoordEmail(e.target.value)} type='text' />
            </label>
            
            <label htmlFor="">
              كلمة السر
              <input  onChange={(e)=>setCoordPassword(e.target.value)} type='text' />
            </label>
            
            <button type='submit'>أضافة</button>
          </form>
</div>
  </div>  : null}

    <div className="container">
    <div className="add">
    <h1>اضف منظمة</h1>
    <form action="" onSubmit={handleAdd} >
            <label htmlFor="">
              الاسم
              <input value={name} onChange={(e)=>setName(e.target.value)} type='text' />
            </label>
            <label htmlFor="">
                    الصورة
                    <input type="file"   onChange={handleImageChange}  />
                </label>
            <button type='submit'>أضافة</button>
          </form>
</div>
<div className="all-users">
    <h1>كل المنظمات</h1>
    <div className="in-all-users">
        {organizations.map((user,index)=>{
            return(
                <div className="user-card" key={index}>
                 <div className="in-user-card">
                    <img src={user.logo} alt="" />
                    <div className="name">{user.name}</div>
                    <div className="name">{user._id}</div>
                    <Link to={`/org/${user._id}`}>بيانات المنظمين</Link>
                    <button className='cord'  onClick={() => addCoord(user._id)}>اضافة منظم</button>
                    <button className='delete' onClick={() => deleteButton(user._id)}>حذف</button>
                    </div> 
                   
                </div>
            )
        })}
    </div>
</div>
    </div>

   </div>
  )
}

export default Organizations