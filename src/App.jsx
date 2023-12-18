import './App.css';
import { BrowserRouter, Link, Route,Routes } from 'react-router-dom';
import Sidebar from './layout/Sidebar/Sidebar';
import ContentTop from './components/ContentTop/ContentTop';
import { createContext, useEffect, useState } from 'react';
import Login from './components/login/Login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Users from './components/users/Users';
import Keys from './components/keys/Keys';
import Questions from './components/ques/Ques';
import Organizations from './components/organizations/Organizations';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Org from './components/org/Org';
import EditUsers from './components/editUser/EditUser';
import Raters from './components/raters/Raters';
import CoordStudents from './components/coordStudent/CoordStudent';
import About from './components/about/About';

export const AppContext =createContext()

function App() {
  const [headTitle,setHeadTitle]=useState("تسجيل الدخول")
  const [login,setLogin]=useState(false)
  const [route ,setRoute]=useState("https://api.benaa-test.com/api/v1")
  const [coordLogin,setCoordLogin]=useState(false)

  const [loader,setLoader]=useState(false)

  useEffect(() => {
    AOS.init();
  }, []);
  useEffect(()=>{
    
      setLogin(sessionStorage.getItem("login"))


  },[login])
  useEffect(()=>{
    
      setCoordLogin(sessionStorage.getItem("coordLogin"))


  },[coordLogin])
  return (
    <AppContext.Provider value={{headTitle
    ,setHeadTitle ,
    route,
    login,
    setLogin ,
    setLoader ,
    setCoordLogin ,
    coordLogin

    }}>
    <>
      <div className='app'>
      <ToastContainer />
{loader ? <div className="loader-cont">
<div class="banter-loader">
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
</div>
</div> : null}
        <Sidebar />
      <div className="the-content">
        <ContentTop />
       
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/المستخدمين" element={<Users />} />
      <Route path="/المفاتيح" element={<Keys />} />
      <Route path="/الاسئلة" element={<Questions />} />
      <Route path="/المنظمات" element={<Organizations/>} />
      <Route path="/org/:id" element={<Org/>} />
      <Route path="/edit/:id" element={<EditUsers/>} />
      <Route path="/rater/:id" element={<Raters/>} />
      <Route path="/my-student" element={<CoordStudents/>} />
      <Route path="/من نحن" element={<About/>} />
      
 
    </Routes>

      </div>
      </div>
    </>
    </AppContext.Provider>
  )
}

export default App
