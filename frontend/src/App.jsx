import { useState, useEffect } from "react";
import { Route, Routes, redirect } from "react-router-dom";

import Navbar from "./Navbar";
import SideBar from "./SideBar";
import NotesBar from "./NotesBar";
import EditLabel from "./EditLabel";
import Page from "./404";
import Unauthorized from "./401";

import "./App.css";
import api from "./api/api";

function App() {
  const [activeSidebar, setActiveSidebar]= useState(true);
  const [open,setOpen]= useState(false);
  const [user,setUser]= useState(false);
  const [labels,setLabels]= useState([]);
  const [search,setSearch]= useState("");

  useEffect(()=>{
      api.get("/auth/check")
          .then(response=>{
            setUser(true);
            setLabels(response.data);
          })
          .catch(err=>{
            redirect("/401");
          });
  },[]);

  console.log(labels);

  return (
    <>
      <Navbar user={user} search={search} setSearch={setSearch} activeSidebar={activeSidebar} setActiveSidebar={setActiveSidebar}/>
      <div id="page">
        {user && <SideBar labels={labels} activeSidebar={activeSidebar} open={open} setOpen={setOpen}/>}
        <Routes>
         {!user && <Route path="*" element={<Unauthorized/>} />}
         {user && <>
          <Route path="" element={<NotesBar search={search} labels={labels} connection={"home"}/>}/>
          <Route path="labels/:id" element={<NotesBar search={search} labels={labels} connection={"label"}/>}/>
          <Route path="archived" element={<NotesBar search={search} labels={labels} connection={"archived"}/>}/>
          <Route path="401" element={<Unauthorized/>} />
          <Route path="*" element={<Page/>} />
         </>}
        </Routes>
        </div>
        {user && <EditLabel labels={labels} setLabels={setLabels} open={open} setOpen={setOpen}/>}
    </>
  );
}

export default App;