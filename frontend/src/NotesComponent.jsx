import Masonry from "react-masonry-css";
import Note from "./NoteComponent";

import "./NotesComponent.css";

const breakpointColumnsObj = {
    default: 5,
    1200: 4,
    1095: 3,
    845: 2,
    610: 1
  };

const NotesComponent=({connection,id,searchedPosts,posts,setPosts,labels})=>{
    return (
        <div className="notesComponent">
            <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
            >
                {
                    searchedPosts.map((post)=>(
                        <div key={post._id}>
                            <Note connection={connection} id={id} post={post} posts={posts} setPosts={setPosts} labels={labels}/>
                        </div>
                    ))
                }
            </Masonry>
        </div>
    );
};

export default NotesComponent;