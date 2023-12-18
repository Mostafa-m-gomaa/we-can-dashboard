import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import './article.css'
import { AppContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Articles = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [title ,setTitle]=useState("")
  const [disc ,setDisc]=useState("")
  const [articles ,setArticles]=useState([])
  const [showConfirm ,setShowConfirm]=useState(false)
  const [artId,setArtId]=useState("")
  const [refresh ,setRefresh]=useState(false)
  const {route ,setLoader ,filesRoute}=useContext(AppContext)

  const handleTitle =(e)=>{
    setTitle(e.target.value)
  }

  const handleDisc =(e)=>{
    setDisc(e.target.value)
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
if (file && file.type.startsWith('image/')) {
  setImage(file);
} else {
  setImage(null);
}
};

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
const deleteButton =(id)=>{
  setShowConfirm(true)
  setArtId(id)
}
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true)

    const formData = new FormData();
    formData.append('title', title);
    formData.append('desc',disc);
    if(file){

      formData.append('pdf',file);
    }
    if(image){

      formData.append('image', image);
    }
    try {
      const response = await fetch(`${route}/article/create`, {
        method: 'POST',
        body: formData,
        headers:{
          "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
        }
      })
      .then(res=>res.json());
      setLoader(false)
      if (response.status=="success") {
  console.log(response)
  toast.success("تمت الأضافة")
  
      } else {
        console.log(response)
        toast.error("هناك خطأ")
      }
    } catch (error) {
   
     
    }
  };

  const deleteArt =()=>{
    setLoader(true)
    setShowConfirm(false)
    fetch(`${route}/article/${artId}`,{
      method :"DELETE" ,
      headers :{
        "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setLoader(false)
      if(data.status === "success"){
toast.success("تم الحذف بنجاح")
setRefresh(!refresh)
      }
      else{
        toast.error("لم يتم الحذف")
      }
    })
  }

  useEffect(()=>{
    fetch(`${route}/article`)
    .then(res=>res.json())
    .then(data=>{
      if(data.data){
        setArticles(data.data)
        console.log(data.data)
      }
    })
  },[refresh])
  return (
<div className="articles">
{showConfirm ?   <div className="confirm">
    <div>هل انت متاكد انك تريد حذف هذا ؟</div>
    <div className="btns">
      <button onClick={deleteArt} className='yes' >Yes</button>
      <button onClick={() => setShowConfirm(false)} className='no'>No</button>
    </div>
  </div> :null}
    <div className="container">
        <div className="add">
          <h1>أضافة مقالة</h1>
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="">
              العنوان
              <input value={title} onChange={handleTitle} type='text' />
            </label>
            <label htmlFor="">
              الشرح
              <input value={disc} onChange={handleDisc} type='text' />
            </label>
            <label htmlFor="">
              الملف
              <input type="file" accept="application/pdf" onChange={handleFileChange} />
             
            </label>
            <label htmlFor="">
              الصورة
              <input type="file"   onChange={handleImageChange}  />
            </label>
            <button type='submit'>أضافة</button>
          </form>
        </div>
        <div className="all-art">
          <h1>المقالات</h1>
          <div className="arts">
            {articles.map((art,index)=>{
              return(
                <div className="article-card" key={index}>
                  <div className="title">{art.title}</div>
                  <div className="desc">{art.desc}</div>
                  {art.pdf ? <a href={`${filesRoute}/${art.pdf}`} target='_blank'>اطلع علي الملف</a>:<div> لا يوجد ملف</div>}
                  {art.image ? <img src={`${filesRoute}/${art.image}`} alt="" />:<div> لا يوجد صورة</div>}
                  <button onClick={() => deleteButton(art.id)}>Delete</button>
                </div>
              )
            })}
          </div>
        </div>
    </div>
</div>
  )
}

export default Articles
