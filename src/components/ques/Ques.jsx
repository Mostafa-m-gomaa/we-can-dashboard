import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { AppContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ques.css'

const Question = () => {
    const {route ,setLoader ,filesRoute}=useContext(AppContext)
    const [refresh ,setRefresh]=useState(false)
    const [text,setText]=useState("")
    const [keys,setKeys]=useState([])
    const [keyId,setKeyId]=useState("")
    const [ques,setQues]=useState([])
    const [showConfirm ,setShowConfirm]=useState(false)
    const [quesId,setQuesId]=useState("")
    const [answerStr,setAnswerStr]=useState("")
    const [correct,setCorrect]=useState("")
    const [editedQues,setEditedQues]=useState("")
    const [editedAnswerStr,setEditedAnswerStr]=useState("")
    const [editedCorrect,setEditedCorrect]=useState("")
    const [editedKeyId,setEditedKeyId]=useState("")
    const [showEdit,setShowEdit]=useState(false)
  const [activeKey,setActiveKey]=useState("")
    const clickEdit =(id)=>{
      setShowEdit(true)
      setQuesId(id)
    }
  
  

    const handleAdd = async (event) => {
      const arrayOfWords = answerStr.split(',');
      const obj ={
        text : text ,
        section : keyId ,
      }
      if(answerStr){
        obj.options=answerStr.split(',')
        obj.correctAnswer=correct
      }

        event.preventDefault();
        setLoader(true)
        try {
          const response = await fetch(`${route}/questions`, {
            method: 'POST',
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
    const handleEdit = async (event) => {
      const editedObject={}
      if(editedQues){
        editedObject.text=editedQues
      }
      if(editedAnswerStr){
        editedObject.options=editedAnswerStr.split(',')
      }
    if(editedCorrect){
      editedObject.correctAnswer=editedCorrect
    }
    if(editedKeyId){
      editedObject.section=editedKeyId
    }
        event.preventDefault();
        setLoader(true)
        try {
          const response = await fetch(`${route}/questions/${quesId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json' ,
              "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify(editedObject)
          })
          .then(res=>res.json())
          console.log(response)
          setLoader(false)
          if (response.data) {
          toast.success("تمت التعديل بنجاح")
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
      }
      const deleteButton =(id)=>{
        setShowConfirm(true)
        setQuesId(id)
      }

      const deleteQues =()=>{
        setLoader(true)
        setShowConfirm(false)
        fetch(`${route}/questions/${quesId}`,{
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
      const clickKey =(id , activeKey)=>{
        setActiveKey(activeKey)
        fetch(`${route}/questions?section=${id}`,{
          headers:{
              "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
          }
      }).then(res=>res.json())
      .then(data=>{
        console.log(data)
        if(data.data){
          setQues(data.data)
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
            
          }
        })
      },[])
    useEffect(()=>{
        fetch(`${route}/questions`,{
            headers:{
                "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
            }
        })
        .then(res=>res.json())
        .then(data=>{
          if(data.data){
            setQues(data.data)
            console.log(data.data)
       
          }
        })
      },[refresh])
  
  return (
<div className="ques">
{showConfirm ?   <div className="confirm">
    <div>هل انت متاكد انك تريد حذف هذا ؟</div>
    <div className="btns">
      <button onClick={deleteQues} className='yes' >Yes</button>
      <button onClick={() => setShowConfirm(false)} className='no'>No</button>
    </div>
  </div> :null}
{showEdit ?     <div className="edit-ques">
  <div className="add-ques">

<h1>تعديل</h1>
<form action="" onSubmit={handleEdit} >
<label htmlFor="">
    السؤال
    <input  onChange={(e)=>setEditedQues(e.target.value)} type="text" />
</label>
<label htmlFor="">
    الاجابات
    <input  onChange={(e)=>setEditedAnswerStr(e.target.value)} type="text" />
</label>
<label htmlFor="">
   الاجابة الصحيحة
    <input  onChange={(e)=>setEditedCorrect(e.target.value)} type="text" />
</label>
<label htmlFor="">
اختر المفتاح 
<select onChange={(e)=>setEditedKeyId(e.target.value)} > 
    <option value="">اختر مفتاح</option>
    {keys.map((key)=>{
        return(
            <option value={key._id}>{key.name}</option>
        )
    })}
</select>
</label>


    <button type='submit'>أضافة</button>
  
  </form>
</div>
  </div> :null}
    <div className="container">
        <div className="add-ques">

        <h1>اضف سؤال</h1>
        <form action="" onSubmit={handleAdd} >
        <label htmlFor="">
            السؤال
            <input value={text} onChange={(e)=>setText(e.target.value)} type="text" />
        </label>
        <label htmlFor="">
            الاجابات
            <input value={answerStr} onChange={(e)=>setAnswerStr(e.target.value)} type="text" />
        </label>
        <label htmlFor="">
           الاجابة الصحيحة
            <input value={correct} onChange={(e)=>setCorrect(e.target.value)} type="text" />
        </label>
     <label htmlFor="">
        اختر المفتاح 
        <select onChange={(e)=>setKeyId(e.target.value)} > 
            <option value="">اختر مفتاح</option>
            {keys.map((key)=>{
                return(
                    <option value={key._id}>{key.name}</option>
                )
            })}
        </select>
     </label>
 
      
            <button type='submit'>أضافة</button>
          
          </form>
        </div>
        <div className="all-ques">
            <h1>الاسئلة</h1>
            <div className="keys-filter">
              <div className='key' onClick={()=>{setRefresh(!refresh) , setActiveKey("")}}>All</div>
              {keys.map((key)=>{
                return(
                  <div className={`key ${key.name === activeKey ? "active-key":""}`} onClick={()=>clickKey(key._id , key.name)} key={key._id}>
                    {key.name}
                  </div>
                )

              })
              }
            </div>
            <div className="in-all-ques">
            {ques.map((ques)=>{
              if(ques.length === 0){
                return(
                  <div>لا يوجد اسئلة</div>)
              }else{

                return(
                    <div className="ques-card" key={ques._id}>
                        <div className="text">{ques.text}</div>
                        
                        <div className="options">
                          <h3>الاختيارات</h3>
<div className="in-options">

                        {ques.options.map((option,index)=>{
                            return(
                                <div className="option" key={index}>
                                    {option}
                                </div>
                            )
                        })}
</div>
<h3>الاجابة الصحيحة</h3>
<div>{ques.correctAnswer}</div>
                        </div>
                        <button className='edit' onClick={()=>clickEdit(ques._id)} >تعديل</button>
                        <button onClick={()=>deleteButton(ques._id)}>حذف</button>
                    </div>
                )
              }
            })}
            </div>
        </div>
    </div>
</div>
  )
}

export default Question
