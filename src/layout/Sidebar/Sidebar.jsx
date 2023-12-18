import { useEffect, useState } from 'react';
import { personsImgs } from '../../utils/images';
import { navigationLinks } from '../../data/data';
import "./Sidebar.css";
import { useContext } from 'react';
import { SidebarContext } from '../../context/sidebarContext';
import myfoto from "../../assets/images/277576572_4930051973790212_6312887034244956070_n.jpg"
import { BsFillArrowRightSquareFill } from 'react-icons/bs';
import { Link ,BrowserRouter } from 'react-router-dom';
import { AppContext } from '../../App';

const Sidebar = () => {
  const [activeLinkIdx,setActiveLinkIdx] = useState(0);
  const [sidebarClass, setSidebarClass] = useState("");
  const { isSidebarOpen } = useContext(SidebarContext);
  const {setHeadTitle ,login ,setLogin ,coordLogin ,setCoordLogin}=useContext(AppContext)

  useEffect(() => {
    if(isSidebarOpen){
      setSidebarClass('sidebar-change');
    } else {
      setSidebarClass('');
    }
  }, [isSidebarOpen]);

  const clickLink =(id ,title)=>{
setActiveLinkIdx(id)
setHeadTitle(title)
  }
  const logOut =()=>{
    sessionStorage.clear()
    setLogin(false)
    setCoordLogin(false)
  }

  return (
   
    <div className={ `sidebar ${sidebarClass}` }>
    
      <div className="user-info">
          <div className="info-img img-fit-cover">
              <img src={ myfoto } alt="profile image" />
          </div>
          <span className="info-name">نعم نستطيع</span>
      </div>

      <nav className="navigation">
        {coordLogin ?   <Link to="/" onClick={logOut}  className={`nav-link ${activeLinkIdx === 0 ? 'active' : ''}`}>
                     <BsFillArrowRightSquareFill />
                      <span className="nav-link-text">تسجيل الخروج</span>
                  </Link> : null}
     {login ?     <ul className="nav-list">
     {login ?       <Link to="/" onClick={logOut}  className={`nav-link ${activeLinkIdx === 0 ? 'active' : ''}`}>
                     <BsFillArrowRightSquareFill />
                      <span className="nav-link-text">تسجيل الخروج</span>
                  </Link>: <Link to="/" onClick={()=>clickLink(0 , "تسجيل الدخول")}  className={`nav-link ${activeLinkIdx === 0 ? 'active' : ''}`}>
                     <BsFillArrowRightSquareFill />
                      <span className="nav-link-text">تسجيل الدخول</span>
                  </Link> }
            {
              navigationLinks.map((navigationLink) => (
                <li className="nav-item"  key = { navigationLink.id }>
                  <Link to={`${navigationLink.title }`} onClick={()=>clickLink(navigationLink.id , navigationLink.title)}  className={`nav-link ${navigationLink.id === activeLinkIdx ? 'active' : ''}`}>
                     <BsFillArrowRightSquareFill />
                      <span className="nav-link-text">{ navigationLink.title }</span>
                  </Link>
                </li>
              ))
            }
          </ul> :null}
      </nav>
    </div>
  
  )
}

export default Sidebar
