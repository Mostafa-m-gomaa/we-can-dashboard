import  './users.css'
import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { AppContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import ReactToExcel from 'react-html-table-to-excel';
import { saveAs } from 'file-saver';
import { font } from './alfont_com_arial-1-normal';
import './alfont_com_arial-1.ttf'
import border from '../../assets/pngfind.com-square-border-png-259718.png'
import screen from '../../assets/Screenshot 2023-10-03 052406.png'
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from '../Loader/Loader';

const Example = () => {
  const {route}=useContext(AppContext)
  const [fullReport,setFullReport]=useState([])
  

  useEffect(()=>{
    sessionStorage.setItem("full",false)
    fetch(`${route}/answer/getUserAnswersReportTotal/${sessionStorage.getItem("userId")}`, {
      headers: {
        Authorization :`Bearer ${sessionStorage.getItem("token")}`
      }
    })
    .then(res=>res.json())
    .then(data=>{

      if (data) {
        if(!JSON.parse(sessionStorage.getItem("full"))){

          data.forEach((item) => {
            const newOb = {
              name: item.key,
            " ذاتي قبلي": item.graph.userBefore,
              "ذاتي بعدي": item.graph.userAfter,
              amt: item.totalDifference.raters,
            };
            setFullReport((prevFullReport) => [...prevFullReport, newOb]);
            sessionStorage.setItem("full",true)
          });
        
        }
       
      }
      
    })
  },[])
 
  return (
    <ResponsiveContainer width="90%" height="100%" >
      <BarChart
        width={200}
        height={100}
        data={fullReport}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis  />
        <Tooltip />
        <Legend />
        <Bar dataKey=" ذاتي قبلي" fill="#28BBBC" />
        <Bar dataKey="ذاتي بعدي" fill="#ed833e" />
      </BarChart>


    </ResponsiveContainer>
  );
};
const ExampleRater = () => {
  const {route}=useContext(AppContext)
  const [fullReport,setFullReport]=useState([])

  useEffect(()=>{
    sessionStorage.setItem("fulla",false)
    fetch(`${route}/answer/getUserAnswersReportTotal/${sessionStorage.getItem("userId")}`, {
      headers: {
       Authorization :`Bearer ${sessionStorage.getItem("token")}`
      }
    })
    .then(res=>res.json())
    .then(data=>{

      if (data) {
        if(!JSON.parse(sessionStorage.getItem("fulla"))){

          data.forEach((item) => {
            const newOb = {
              name: item.key,
            " أخرين قبلي": item.graph.raterBefore,
              "أخرين بعدي": item.graph.raterAfter,
              amt: item.totalDifference.raters,
            };
            setFullReport((prevFullReport) => [...prevFullReport, newOb]);
            sessionStorage.setItem("fulla",true)
          });
        
        }
       
      }
      
    })
  },[])
 
  return (
    <ResponsiveContainer width="90%" height="100%">
      <BarChart
        width={200}
        height={100}
        data={fullReport}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis  />
        <Tooltip />
        <Legend />
        <Bar dataKey=" أخرين قبلي" fill="#28BBBC" />
        <Bar dataKey="أخرين بعدي" fill="#ed833e" />
      </BarChart>


    </ResponsiveContainer>
  );
};



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
    const [showUsers,setShowUsers]=useState(true)
    const [phone,setPhone]=useState("")
    const [showFullReport,setShowFullReport]=useState(false)
    const [fullReport,setFullReport]=useState([])
    const [theUserId,setTheUserId]=useState("")
    const [quesReport,setQuesReport]=useState(false)
    const [userQuestions,setUserQuestions]=useState([])
    const [user,setUser]=useState({})
    const [pagination,setPagination]=useState(0)
    const [paginationPage,setPaginationPage]=useState(1)
    const myStyle = {
    display:"none"
      // Add any other styles as needed
    };

const [filters, setFilters] = useState({
  page : paginationPage ,
  organization : "" ,
  code : "" ,
  name : "" ,
  email : "" ,
  phone : "" ,

})


    const handleFilterChange = (key, value) => {
      setRefresh(!refresh)
      setFilters((prev) => ({
        ...prev,
        [key]: value || undefined, // Ensure empty values are removed
      }));
   
    };
    const [searchValue,setSearchValue]=useState("code")

    const [file, setFile] = useState(null);

    const handleFileUpload = (e) => {
      const uploadedFile = e.target.files[0];
      if (uploadedFile && uploadedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        setFile(uploadedFile); // Store the file
      } else {
        alert("Please upload a valid .xlsx file");
      }
    };
  
    const handleSubmit = async () => {
      if (!file) {
        alert("No file uploaded!");
        return;
      }
      setLoader(true)
  
      const formData = new FormData();
      formData.append("file", file); // Attach the file to the FormData
  
      try {
        const response = await fetch(`${route}/users/storeManyUsers`, {
          method: "POST",
          body: formData, // Send the file in the request body
        });
        const result = await response.json();
        setLoader(false)
        toast.success(result.message)
        for(let i = 0 ; i<result.existingUsers.length ; i++){
          toast.warning(`${result.existingUsers[i].email} موجود بالفعل`)
        }
       
        console.log(result);
      
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };

    const questionsReport =(id)=>{
      setLoader(true)
      fetch(`${route}/users/getUserReport/${id}`,{
        headers:{
          "Authorization" :`Bearer ${sessionStorage.getItem("token")}`}
      })
      .then(res=>res.json())
      .then(data=>{
        setLoader(false)
      console.log(data)
        if(data.status === "fail"){
          toast.error(data.message)
        }
        else if(data.user){
          setQuesReport(true)
          setUserQuestions(data.report)
          setUser(data.user)
        }
        else{
          toast.error("لم يتم العملية")
        }
    
      })
    }

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
       
            if(res.ok){
      toast.success("تم الحذف بنجاح")
      setRefresh(!refresh)
            }
            else{
              toast.error("لم يتم الحذف")
            }
        })
     
      }
      const skipRater =(id)=>{
        setLoader(true)
        setShowConfirm(false)
        fetch(`${route}/users/availUserToSkipRaters/${id}`,{
          method :"PUT" ,
          headers :{
            "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
          }
        })
        .then(res => res.json())
        .then(data => {
          setLoader(false)
         
          if(data.status === "success"){
            toast.success("done")
            setRefresh(!refresh)
          }
          else if(data.status === "faild"){
            toast.error(data.msg)
          }
        })
     
      }

      const getFullReport =(id)=>{
        sessionStorage.setItem("userId",id)
        setTheUserId(id)
        setLoader(true)
        fetch(`${route}/answer/getUserAnswersReportTotal/${id}`, {
          headers: {
            Authorization :`Bearer ${sessionStorage.getItem("token")}`
          }
        })
        .then(res=>res.json())
        .then(data=>{
     setLoader(false)
         
          if(data.errors){
            toast.error(data.errors[0].msg)
          }
         else if(data.status === "failed"){
            toast.error(data.msg)
          }
         else if(data.message){
            toast.error(data.message)
          }
          else if(data){
            setShowFullReport(true)
            setFullReport(data)
          }
          else{
            toast.error("لم تكمل الخطوات")
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
      
            setLoader(false)
            console.log(data)
            if(data.status ==="success"){
                toast.success(data.msg)
                setRefresh(!refresh)
            }
            if(data.status === "faild"){
                toast.error(data.msg)
                
            }

        })
      }
      const selectManyUsers =(change)=>{
        setLoader(true)
        fetch(`${route}/users/updateManyUsers`,{
          method :"PUT" ,
          headers :{
            "Authorization" :`Bearer ${sessionStorage.getItem("token")}` ,
            "Content-Type": "application/json"
          } ,
          body : JSON.stringify({
            ids : selectedIds,
            change :change
          })
        }).then(res=>res.json())
        .then(data => {
      
            setLoader(false)
            if(data.status ==="success"){
                toast.success(data.msg)
            }
            if(data.status === "faild"){
                toast.error(data.msg)
                
            }

        })
      }

      const exportReport =  () => {
        html2canvas(document.getElementById('element')).then(canvas => {
          const screenshotDataUrl = canvas.toDataURL();
          const screenshotImage = new Image();
          screenshotImage.src = screenshotDataUrl;
    
          // const doc = new jsPDF({ orientation: "landscape" });
          const doc = new jsPDF({
            orientation: 'portrait', // 'portrait' or 'landscape' orientation
            unit: 'mm', // Measurement unit (millimeters)
            format: ['280', '300'], // Page size defined by width and height
          });
          
        
          doc.addFileToVFS('alfont_com_arial-1.ttf', font);
          doc.addFont('alfont_com_arial-1.ttf', 'alfont_com_arial-1', 'normal');
          doc.setFont("alfont_com_arial-1");
          // const text = 'التقرير الجمعي لمقياس';
          // doc.addImage(border, 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
          // doc.setFontSize(40);
          // doc.text(text , 90, 50 );
          // doc.addImage(logo, 'JPEG' , 80,90,120,30)
          // doc.setFontSize(30);
          // doc.text(`قياس أثر البرنامج `, 105, 160);
          // doc.setFontSize(25);
          // doc.text(`مجموعة بناء`, 117, 190);
    
          doc.addImage(screen, 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
        
          fullReport.forEach((tableData, index) => {
            // if (index !== 0) {
            //   doc.addPage();
            // }
            doc.addPage();
            doc.addImage(border, 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
            doc.addImage(logo, 'JPEG' , 10,10,40,15)
            doc.setFontSize(20);
            doc.setTextColor(232, 234, 237, 1.00);
            doc.text(`: ${tableData.key}`, 210, 50);
            doc.text(`: ${tableData.key}`, 210, 100);
        
        
            doc.autoTable({
              html: `#sayed${index}`,
              styles: {
                font: 'alfont_com_arial-1', // Set the font to the Arabic font
                fontSize: 13, // Adjust the font size as needed
                valign: 'middle', // Center vertically
                halign: 'center', // Center horizontally
              },
              theme:"grid",
              startY: 120
            });
            doc.autoTable({
              html: `#small${index}`,
              styles: {
                font: 'alfont_com_arial-1', // Set the font to the Arabic font
                fontSize: 11, // Adjust the font size as needed
                valign: 'middle', // Center vertically
                halign: 'center', // Center horizontally
              },
              theme:"grid",
              startY: 60
            });
          });
      
          
          doc.addPage();
          doc.addImage(logo, 'JPEG' , 5,5,40,15)
          // doc.text("مقياس نعم أستطيع", 130, 35);
          doc.addImage(screenshotImage , 'JPEG' , 5,20 , 220 , 250)
           doc.save("mypddf.pdf");
     
        });
     
        // doc.text(sessionStorage.getItem("email"), 20, 50);
        // doc.text(sessionStorage.getItem("userName"), 200, 50);
        // doc.text(keyName, 120, 50);
        
      };
const filterOrg =(id)=>{
  
  fetch(`${route}/users?organization=${id}`,{
    headers:{
        "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
    }
}) 
.then(res=>res.json())
.then(data=>{
  if(data.data){
    setUsers(data.data)
  }
})
}
const search =(code)=>{
  if(code === ""){
    setRefresh(!refresh)
  }
  fetch(`${route}/users?${searchValue}=${code}`,{
    headers:{
        "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
    }
}) 
.then(res=>res.json())
.then(data=>{
  console.log(data)
  if(data.data){
    setUsers(data.data)
  }

})
}
const [usersLoader,setUsersLoader]=useState(false)

      useEffect(()=>{
        setUsersLoader(true)
        const filteredParams = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value) // Remove empty values
        );
        const queryString = new URLSearchParams(filteredParams).toString();
     

        fetch(`${route}/users?limit=200 && ${queryString}`,{
            headers:{
                "Authorization" :`Bearer ${sessionStorage.getItem("token")}`
            }
        }) 
        .then(res=>res.json())
        .then(data=>{
     
          setUsersLoader(false)
          if(data.data){
            console.log(data)
            setUsers(data.data)
            setPagination(data.paginationResult.numberOfPages)
           
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
 
          }
        })
      },[])

      const [selectedIds, setSelectedIds] = useState([]);

      const handleCheckboxChange = (id, isChecked) => {
        setSelectedIds((prev) =>
          isChecked
            ? [...prev, id] // Add the ID if checked
            : prev.filter((userId) => userId !== id) // Remove the ID if unchecked
        );

 
      };

      const exportToExcel =()=>{
        setLoader(true)
        const worksheetData = users.map((user)=>({
          "Name" : user.name ,
          "Email" : user.email ,
          "Code" : user.code ,
          "Phone" : user.phone ,
          "First Quiz" : user.quizStatus ,
          "Sec Quiz" : user.retakeQuizAt ? "finished" : "no" ,
          "Organization" : user.organization ? user.organization.name : "لا يوجد" ,
          "Allowed Keys" : user.allowed_keys.length === 0 ? "لا يوجد مفاتيح" : user.allowed_keys.map((key)=>(key.name)).join(", ")
        }))

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
      
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
      
        saveAs(data, "usersData.xlsx");
        setLoader(false)
      }

      
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

{showUsers ?
<div className="all-users">
  <div onClick={()=>setShowUsers(false)} className="close">X</div>
    <h1>كل الاعضاء</h1>
    {/* <ReactToExcel table="table" filename="userSheet" sheet="sheet1" buttonText="export" className="export-button" /> */}
    <button className='button' style={{ padding: "5px 20px" , margin:"10px 0" }} onClick={exportToExcel}>export excel</button>
    <div className="filter">
      <div>
        <select onChange={(e)=>handleFilterChange( "organization",e.target.value)}  id="">
          <option >filter by org</option>
        {organizations.map((item)=>{
        return(
          <option value={item._id}>{item.name}</option>
        )
      })}
      </select></div>
      <div className="search-bar">
<select name="" id="" onChange={(e)=>setSearchValue(e.target.value)}>
  <option value="code"> code</option>
  <option value="name"> name</option>
  <option value="email"> email</option>
  <option value="phone"> phone</option>
</select>
      <input type="text" onChange={(e)=>handleFilterChange( searchValue,e.target.value)} placeholder='enter the value' />
      </div>
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileUpload}
      
      />
           <button onClick={handleSubmit} style={{ padding: "5px 20px" }}>
        Submit 
      </button>
     
    </div>

    {selectedIds.length > 0 ?     <div className='selected-btns'>
      <button onClick={()=>selectManyUsers("skipRaters")}>تخطي المقيمين</button>
      <button onClick={()=>selectManyUsers("availUsersToRetakeTakeQuiz")}>السماح بالاختبار الثاني </button>
    </div>: null}

    <div className="in-all-users">
      

{usersLoader ? <Loader /> :
  <table className="users-table" id='table'>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Code</th>
      <th>Phone</th>
      <th>First Quiz</th>
      <th>Sec Quiz</th>
      <th>Organization</th>
      <th>Allowed Keys</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
  {users.length > 0 ?
  users.map((user, index) => (
    <tr key={index}>
      <td className='check-box'>
         <input type="checkbox"
              onChange={(e) => handleCheckboxChange(user._id, e.target.checked)} /> 
              <span>{user.name}</span>
               </td>
      <td>{user.email}</td>
      <td>{user.code}</td>
      <td>{user.phone ? user.phone : "null"}</td>
      <td> {user.retakeQuizAt ? "finished" : user.quizStatus}</td>
      <td>{user.retakeQuizAt ? "finished" : "no"}</td>
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
            {user.quizStatus != "ready"   ?       <button className="again" onClick={() => takeAgain(user._id)}>
              السماح بالاختبار الثاني    
                        </button>: null}

             <button onClick={()=>getFullReport(user._id)} className="again" >
             التقرير الشامل

              </button>
              {user.skipRaters ? null:  <button onClick={()=>skipRater(user._id)} className="again" >
تخطي المقيمين
              </button>}
            
              <button onClick={()=>questionsReport(user._id)}>تقرير الاسئلة</button>


      
          </div>
          
        )}
      </td>
    </tr>
  ))
  : "لا يوجد بيانات"}
</tbody>
</table>}

    </div>


    <div className="pagination"> page  <input placeholder={paginationPage} type="text" onChange={(e)=>handleFilterChange("page", e.target.value) } />  of {pagination}</div>
</div> :null}
{quesReport ?<div className="all-users">
  <div onClick={()=>setQuesReport(false)} className="close">X</div>
    <h1>طباعه الملف</h1>
    <ReactToExcel table="qq" filename="userSheet" sheet="sheet1" buttonText="export" className="export-button" />
    <div className="in-all-users">
      

<table className="users-table" style={myStyle} id='qq'>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>id</th>
      <th>state</th>
      {userQuestions.map((item) => {
    return (
      <th>{item.question}</th>
    );
  })}
      <th>state</th>
      <th>rater</th>
      {userQuestions.map((item) => {
    return (
      <th>{item.question}  <br />  </th>
    );
  })}
  <th>state</th>
  {userQuestions.map((item) => {
    return (
      <th>{item.question}  <br />  </th>
    );
  })}
   <th>state</th>
   
   {userQuestions.map((item) => {
    return (
      <th>{item.question}  <br />  </th>
    );
  })}
   <th>state</th>
   <th>rater</th>
   {userQuestions.map((item) => {
    return (
      <th>{item.question}  <br />  </th>
    );
  })}
   <th>state</th>

   {userQuestions.map((item) => {
    return (
      <th>{item.question}  <br />  </th>
    );
  })}
     
    </tr>
    <tr>
      <th>""</th>
      <th>""</th>
      <th>""</th>
      <th>""</th>
      {userQuestions.map((item) => {
    return (
      <th>{item.key}</th>
    );
  })}
      <th>""</th>
      <th>""</th>
      {userQuestions.map((item) => {
    return (
      <th>{item.key}  <br />  </th>
    );
  })}
  <th>""</th>
  {userQuestions.map((item) => {
    return (
      <th>{item.key}  <br />  </th>
    );
  })}
   <th>""</th>
   
   {userQuestions.map((item) => {
    return (
      <th>{item.key}  <br />  </th>
    );
  })}
   <th>""</th>
   <th>""</th>
   {userQuestions.map((item) => {
    return (
      <th>{item.key}   </th>
    );
  })}
   <th>""</th>

   {userQuestions.map((item) => {
    return (
      <th>{item.key}  <br />  </th>
    );
  })}
     
    </tr>
  </thead>
  <tbody>
    <tr>
  <td>{user.name}</td>
  <td>{user.email}</td>
  <td>{user.code}</td>
  <td>User Before</td>
  {userQuestions.map((item) => {
    return (
      <td>{item.userAnswerBefore}</td>
    );
  })}
  <td>rater Before</td>
  <td>1</td>
  {userQuestions.map((item) => {
    return (
      <td>{item.raterBefore[0]}</td>
      
    );
  })}
  <td>Rater Vaerage Before</td>
  {userQuestions.map((item) => {
    return (
      <td>{item.avgBefore}</td>
      
    );
  })}
  <td>User After</td>
  {userQuestions.map((item) => {
    return (
      <td>{item.userAnswerBefore}</td>
      
    );
  })}
   <td>rater After</td>
  <td>1</td>
  {userQuestions.map((item) => {
    return (
      <td>{item.raterAfter[0]}</td>
      
    );
  })}
   <td>Rater Vaerage After</td>
  {userQuestions.map((item) => {
    return (
      <td>{item.avgAfter}</td>
      
    );
  })}
</tr>
    <tr>
  <td>{user.name}</td>
  <td>{user.email}</td>
  <td>{user.code}</td>
  <td>User Before</td>
  {userQuestions.map((item) => {
    return (
      <td>""</td>
    );
  })}
  <td>rater Before</td>
  <td>2</td>
  {userQuestions.map((item) => {
    return (
      <td>{item.raterBefore[1]}</td>
      
    );
  })}
   <td>""</td>
  {userQuestions.map((item) => {
    return (
      <td>""</td>
      
    );
  })}
    <td>""</td>
  {userQuestions.map((item) => {
    return (
      <td>""</td>
      
    );
  })}
   <td>rater After</td>
  <td>2</td>
  {userQuestions.map((item) => {
    return (
      <td>{item.raterAfter[1]}</td>
      
    );
  })}
     <td>""</td>
  {userQuestions.map((item) => {
    return (
      <td>""</td>
      
    );
  })}
</tr>
    <tr>
  <td>{user.name}</td>
  <td>{user.email}</td>
  <td>{user.code}</td>
  <td>User Before</td>
  {userQuestions.map((item) => {
    return (
      <td>""</td>
    );
  })}
  <td>rater Before</td>
  <td>3</td>
  {userQuestions.map((item) => {
    return (
      <td>{item.raterBefore[2]}</td>
      
    );
  })}
     <td>""</td>
  {userQuestions.map((item) => {
    return (
      <td>""</td>
      
    );
  })}
    <td>""</td>
  {userQuestions.map((item) => {
    return (
      <td>""</td>
      
    );
  })}
   <td>rater After</td>
  <td>3</td>
  {userQuestions.map((item) => {
    return (
      <td>{item.raterAfter[2]}</td>
      
    );
  })}
       <td>""</td>
  {userQuestions.map((item) => {
    return (
      <td>""</td>
      
    );
  })}
</tr>
    
  </tbody>
</table>

    </div>
</div> :null}

{showFullReport ?<div className="full-report">
          <div className="over" onClick={()=>setShowFullReport(false)}></div>
          <div className="in-full">
<h1>التقرير المجمع</h1>
            {fullReport && fullReport.map((rep,index)=>{
              return(
                <div className="table" key={index}>
                  <h2>{rep.key}</h2>
                  <table id={`sayed${index}`} >
        <thead>
          <tr>
            <th> فرق المقيمين</th>
            <th> فرق الذاتي</th>
            <th> المقيمين قبل</th>
            <th> المقيمين بعد</th>
            <th>ذاتي بعد</th>
            <th>ذاتي قبل</th>
            <th>السؤال</th>
          </tr>
        </thead>
        <tbody>
          {rep.questions.map((item, index) => (
            <tr key={index}>
              <td>{item.avg.raters }</td>
              <td>{ item.avg.user}</td>
              <td>{item.before.raters}</td>
              <td>{item.after.raters}</td>
              <td>{item.after.user}</td>
              <td>{item.before.user}</td>
              <td>{item.question}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>{rep.key}</h2>
      <table id={`small${index}`} className='small'>
        <thead>
          <tr>
            <th> ذاتي </th>
            <th> الأخرين</th>
           
          </tr>
        </thead>
        <tbody>
          
            <tr >
              <td>{rep.totalDifference.raters }</td>
              <td>{rep.totalDifference.user }</td>
                        </tr>
        
        </tbody>
      </table>
                </div>
              )
            })}
            
<div className="graph" id="element">
<div className='grapgh-title'>مقياس نعم أستطيع (ذاتي)</div>
            <div id="element1">
            <Example />
            </div>
            <div className='grapgh-title'>مقياس نعم أستطيع (أخرين)</div>
            <div id="element1">
            
            <ExampleRater/>            </div>
</div>
           
            
            
            {/* // <button  onClick={exportReport}>تحميل</button >  */}
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
    