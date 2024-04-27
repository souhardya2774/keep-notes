import { useEffect, useState } from "react";

import logo from "./assets/keep_2020q4_48dp.png";
import "./Navbar.css";


import { GiHamburgerMenu } from "react-icons/gi";
import { MdSearch, MdLogin, MdLogout } from "react-icons/md";

import { Link } from "react-router-dom";
import api from "./api/api";

function Navbar({user, search, setSearch, activeSidebar, setActiveSidebar}) {
    const toggleSidebar=()=>{
        setActiveSidebar(!activeSidebar);
    };


    const google= ()=>{
        window.open("http://localhost:8080/auth/google","_self");
    };

    const logout=async ()=>{
        window.open("http://localhost:8080/auth/logout","_self");
    };

  return (
    <nav className="flex">
        <div className="flex" id="leftNav">
            <button id="sideBarButton" onClick={toggleSidebar}>
                <GiHamburgerMenu id="sideBar"/>
            </button>
            <Link className="flex" to="/">
                <img src={logo} alt="Logo" />
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
                <p className="logEle">Log In</p>
            </div>}
            {user &&
            <div aria-label="Logout" id="logout" className="flex" onClick={logout}>
                <MdLogout className="logEle"/>
                <p className="logEle">Log out</p>
            </div>}
        </div>
    </nav>
  );
}

export default Navbar;