import { useEffect, useState } from "react";

import logo from "./assets/keep_2020q4_48dp.png";
import "./Navbar.css";


import { GiHamburgerMenu } from "react-icons/gi";
import { MdSearch, MdLogin, MdLogout, MdPerson } from "react-icons/md";

import { Link, useLocation } from "react-router-dom";

function Navbar({user, search, setSearch, activeSidebar, setActiveSidebar}) {
    const location = useLocation();
    const isProfilePage = location.pathname === '/profile';
    
    const toggleSidebar=()=>{
        setActiveSidebar(!activeSidebar);
    };

    const closeSidebarOnMobile = () => {
        if (window.innerWidth <= 768 && activeSidebar) {
            setActiveSidebar(false);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && !activeSidebar) {
                setActiveSidebar(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeSidebar, setActiveSidebar]);


    const google= ()=>{
        window.open("http://localhost:8080/auth/google","_self");
    };

    const logout=async ()=>{
        window.open("http://localhost:8080/auth/logout","_self");
    };

  return (
    <nav className="flex">
        <div className="flex" id="leftNav">
            <button id="sideBarButton" onClick={toggleSidebar} aria-label="Toggle sidebar">
                <GiHamburgerMenu id="sideBar"/>
            </button>
            <Link className="flex" to="/" onClick={closeSidebarOnMobile}>
                <img src={logo} alt="Keep Logo" />
                <h1>Keep</h1>
            </Link>
        </div>
        <div className="flex" id="searchbar">
            <form className="flex" aria-label="search" method="get" autoComplete="false" id="searchBox">
                <label htmlFor="search">
                    <MdSearch className="scale1"/>
                </label>
                <input type="search" id="search" placeholder="Search" value={search} onChange={(e)=>setSearch(e.target.value)}/>
            </form>
        </div>
        <div className="flex" id="rightNav">
            {!user && 
            <div aria-label="Login" id="login" className="flex" onClick={google}>
                <MdLogin className="logEle"/>
                <span className="logEleText">Log In</span>
            </div>}
            {user && (
            <>
                <Link 
                    to="/profile" 
                    className={`flex profile-nav-btn ${isProfilePage ? 'active' : ''}`}
                    onClick={closeSidebarOnMobile}
                    aria-label="Profile"
                >
                    <MdPerson className="logEle"/>
                    <span className="logEleText">Profile</span>
                </Link>
                <div aria-label="Logout" id="logout" className="flex" onClick={logout}>
                    <MdLogout className="logEle"/>
                    <span className="logEleText">Log out</span>
                </div>
            </>)}
        </div>
    </nav>
  );
}

export default Navbar;