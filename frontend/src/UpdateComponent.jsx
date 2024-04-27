import { Box, Input, Modal } from "@mui/material";
import { useState } from "react";
import { MdOutlineMoreVert, MdOutlineArchive, MdDeleteOutline, MdOutlineUnarchive } from "react-icons/md";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useClick, useFloating, offset, autoUpdate, useInteractions } from '@floating-ui/react';

import "./InputComponent.css";
import "./EditLabel.css";
import api from './api/api';

const style = {
  position: 'absolute',
  top: '25%',
  maxWidth: 600,
  bgcolor: "white",
  p: 2,
};

const style1 = {
    position: 'absolute',
    top: '45%',
    left: '35%',
    minWidth: 360,
    bgcolor: "white",
    borderRadius: "4px",
    p: 2,
};

const UpdateComponent=({connection,id,post,posts,setPosts,labels,open,setOpen})=> {

    const [newNoteTitle,setNewNoteTitle]= useState(post.title);
    const [newNoteInput,setNewNoteInput]= useState(post.body);
    const [selected,setSelected]= useState((post.labels).map(label=>label.name));
    const [isOpen,setIsOpen]= useState(false);
    const [openDelete,setOpenDelete]= useState(false);

  const handleClose=()=>{
    console.log(open);
    api.put(`/notes/${post._id}`,{
        title: newNoteTitle,
        body: newNoteInput,
        selected: selected
    }).then(res=>{
        if(res.data.success){
            const labelsN= res.data.updateNote.labels;
            console.log("Updated --> ",res.data.updateNote);
            let here= !(connection=="label");
            for(let i=0;i<labelsN.length;i+=1){
                if(labelsN[i]._id==id){
                    here=true;
                }
            }
            if(here)setPosts(posts.map(postL=>((postL._id)==post._id)?res.data.updateNote:postL));
            else setPosts(posts.filter(postL=>(postL._id !==post._id)));
        }
    }).catch(err=>console.log(err))
    setOpen(false);
  };

  const handleArchive=()=>{
    api.put(`/notes/${post._id}`,{
        title: newNoteTitle,
        body: newNoteInput,
        selected: selected
    }).then(res=>{
        if(res.data.success){
            api.post("/notes/archived",{
                noteId: post._id
            })
            .then(res=>{
                if(res.data.success){
                    if(connection!=="label")setPosts(posts.filter(postL=>(postL._id!==post._id)));
                    else setPosts(posts.map(postL=>(postL._id===post._id)?{
                        ...postL,
                        status: (postL.status==="none")?"archived":"none"
                    }:postL));
                }
            })
            .catch(err=>{
                console.log(err);
            });
        }
    }).then(err=>console.log(err));
        setOpen(false);
  };

  const handleDeleteNote=()=>{
    api.delete(`/notes/${post._id}`)
        .then(res=>{
            if(res.data.status){
                setPosts(posts.filter(postL=>(postL._id!==post._id)));
            }
        }).catch(err=>console.log(err));
    handleOpenDelete();
    handleCloseWithoutSave();
  };

  const handleDelete=()=>{
    setOpenDelete(true);
  };

  const handleCloseWithoutSave=()=>{
    setOpen(false);
  };

  const handleOpenDelete=()=>{
    setOpenDelete(false);
  };

  const changeSelected=(labelName)=>{
    if(selected.indexOf(labelName)==-1){
        setSelected([...selected,labelName]);
    }else{
        setSelected((selected).filter((select)=>select!=labelName));
    }
};

  const {refs,floatingStyles,context}= useFloating({
        placement: 'bottom-start',
        middleware: [offset(-4)],
        whileElementsMounted: autoUpdate,
        open: isOpen,
        onOpenChange: setIsOpen,
    });
  const click = useClick(context);

const {getReferenceProps, getFloatingProps} = useInteractions([
    click,
]);

  return (
    <div>
        <Modal
        open={open}
        onClose={handleClose}
        >
          <Box sx={style} id="componentUdpute">
                    <input aria-label="New note title input box" type="text" name="newNoteTitleInput" id="newNoteTitleInput" placeholder="Title" value={newNoteTitle} onChange={(e)=>setNewNoteTitle(e.target.value)}/>
                    <TextareaAutosize minRows={1} aria-label="New note body input box" name="newNoteBodyInput" id="newNoteBodyInput" placeholder="Take a note..." value={newNoteInput} onChange={(e)=>setNewNoteInput(e.target.value)}/>
                    <div className="showLabels">
                        {
                            (selected).map((label)=>(
                                <div key={label} className="showLabel flex">
                                    <p>{label}</p>
                                </div>
                            ))
                        }
                    </div>
                    <div className="buttons flex">
                        <div className="buttons-right flex">
                            <div onClick={handleArchive}>
                                {!(post.status==="archived") && <MdOutlineArchive className="scale2"/>}
                                {(post.status==="archived") && <MdOutlineUnarchive className="scale2"/>}
                            </div>
                            <div ref={refs.setReference} {...getReferenceProps()}>
                                <MdOutlineMoreVert className="scale2"/>
                            </div>
                            <div onClick={handleDelete}>
                                <MdDeleteOutline className="scale2"/>
                            </div>
                        </div>
                        <button type="button" className="button-left" onClick={handleCloseWithoutSave}>
                            Close
                        </button>
                    </div>
                    {isOpen && 
                    <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
                        <div className="addLabel">
                            <p>Label note</p>
                            <Input className="input" placeholder="Enter label name"/>
                            <FormGroup className="addLadelPos">
                                {labels.map((label)=>
                                <FormControlLabel
                                control={
                                    <Checkbox
                                    checked={(selected).indexOf(label.name)!==-1}
                                    onChange={(e)=>changeSelected(label.name)}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                                    name={label.name}
                                    />
                                }
                                label={label.name}
                                key={label._id}
                                >
                                </FormControlLabel>
                                )}
                            </FormGroup>
                        </div>
                    </div>
                    }
          </Box>
        </Modal>
        <Modal
        open={openDelete}
        onClose={handleOpenDelete}
        >
            <Box sx={style1}>
                <p style={{padding:"2px"}}>Note will be deleted forever!</p>
                <p>Are you sure ?</p>
                <div className="buttons flex">
                    <div className="buttons-right flex">
                    </div>
                    <div className="flex">
                        <button type="button" className="button-left" onClick={handleOpenDelete}>
                            Cancel
                        </button>
                        <button type="button" className="button-left" style={{color:"blue"}} onClick={handleDeleteNote}>
                            Delete
                        </button>
                    </div>
                </div>
            </Box>
        </Modal>
    </div>
  );
};

export default UpdateComponent;