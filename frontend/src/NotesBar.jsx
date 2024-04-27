import { useEffect, useState } from "react";
import InputComponent from "./InputComponent";
import NotesComponent from "./NotesComponent";
import api from "./api/api";
import { redirect, useNavigate, useParams } from "react-router-dom";

const NotesBar=({search,labels,connection})=>{
    const [posts,setPosts]= useState([]);
    const id= useParams().id;
    const navigate = useNavigate();

    useEffect(()=>{
        if(connection==="home"){
            api.get("/notes").then(res=>setPosts(res.data)).catch(err=>{
                redirect("/401");
            });
        }else if(connection==="label"){
            if(!id){
                return redirect("/404");
            }
            api.get(`/labels/${id}`).then(res=>setPosts(res.data)).catch(err=>{
                navigate("/404");
            });
        }else if(connection==="archived"){
            api.get("/notes/archived").then(res=>setPosts(res.data)).catch(err=>{
                redirect("/401");
            });
        }else{
            redirect("/404");
        }
        console.log(posts.length);
    },[connection,labels,id]);

    console.log(search,labels,connection);

    const searchedPosts= posts.filter((post)=>((post.title.toLowerCase()).includes(search.trim().toLowerCase()) || (post.body.toLowerCase()).includes(search.trim().toLowerCase())));
    
    return (<main>
        {(connection!=="archived") && <InputComponent connection={connection} id={id} labels={labels} posts={posts} setPosts={setPosts}/>}
        <NotesComponent connection={connection} id={id} searchedPosts={searchedPosts} posts={posts} setPosts={setPosts} labels={labels} />
    </main>);
};

export default NotesBar;