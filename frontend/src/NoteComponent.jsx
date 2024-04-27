import { useState } from "react";
import UpdateComponent from "./UpdateComponent";


const Note = ({connection,id,post,posts,setPosts,labels}) => {
    const [open,setOpen]= useState(false);

  return (
    <>
    <div className="noteComponent" onClick={(e)=>{
        console.log(open);
        setOpen(true);
    }}>
        <div className="noteTitle">{post.title}</div>
        {
            !(post.title || post.body || post.labels.length) &&
            <>
            <div className="noteTitle">Empty Note</div>
            </>
        }
        <div className="noteNote">{((post.body).length>369)?(post.body.slice(0,369))+"...":post.body}</div>
        <div className="noteLabels showLabels">
            {
                (post.labels).map((label)=>(
                    <div key={label._id} className="noteLabel">{label.name}</div>
                ))
            }
        </div>
    </div>
    {
        open
        &&
        <UpdateComponent connection={connection} id={id} post={post} posts={posts} setPosts={setPosts} labels={labels} open={open} setOpen={setOpen}/>
    }
    </>
  );
};

export default Note;