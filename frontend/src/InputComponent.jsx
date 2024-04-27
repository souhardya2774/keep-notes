import { MdOutlineCheckBox, MdOutlineImage, MdOutlineMoreVert } from "react-icons/md";
import { BiSolidPaint } from "react-icons/bi";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { FormGroup, FormControlLabel, Checkbox, Input } from "@mui/material";
import { useClick, useFloating, offset, autoUpdate, useInteractions } from '@floating-ui/react';

import "./InputComponent.css";
import { useState } from "react";
import api from "./api/api";

const InputComponent=({connection,id,labels,posts,setPosts})=>{
    const [placeholder,setPlaceholder]= useState(true);
    const [isOpen,setIsOpen]= useState(false);
    const full=()=>{
        setPlaceholder(false);
    };

    const send=async ()=>{
        setPlaceholder(true);
        setIsOpen(false);
        try {
            const res=await api.post("/notes",{
                title: newNoteTitle,
                body: newNoteInput,
                selected: selected
            });
            if(res.data.success){
                const labelsN= res.data.newOne.labels;
                console.log("Updated --> ",res.data.newOne);
                let here= !(connection=="label");
                for(let i=0;i<labelsN.length;i+=1){
                    if(labelsN[i]._id==id){
                        here=true;
                    }
                }
                if(here)setPosts([res.data.newOne,...posts]);
            }
        } catch (err) {
            console.log(err);
        }
        setNewNoteTitle("");
        setNewNoteInput("");
        setSelected([]);
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

    const [newNoteTitle,setNewNoteTitle]= useState("");
    const [newNoteInput,setNewNoteInput]= useState("");
    const [selected,setSelected]= useState([]);

    const changeSelected=(labelName)=>{
        if(selected.indexOf(labelName)==-1){
            setSelected([...selected,labelName]);
        }else{
            setSelected((selected).filter((select)=>select!=labelName));
        }
    };

    return (<>

        {
            placeholder &&
            <form id="inputComponent" className="flex" onClick={full}>
                <input placeholder="Take a note..." aria-label="new note input" type="text" name="newNoteInput" id="newNoteInput" />
                <div className="flex">
                <div role="button">
                    <MdOutlineCheckBox className="scale1"/>
                </div>
                <div role="button">
                    <BiSolidPaint className="scale1"/>
                </div>
                <div role="button">
                    <MdOutlineImage className="scale1"/>
                </div>
                </div>
            </form>
        }

        {
            !placeholder &&
            <div id="realInputComponent">
                <div className="fullBody" onClick={send}></div>
                <form id="componentInput" onSubmit={(e)=>{
                    e.preventDefault();
                }}>
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
                            <div ref={refs.setReference} {...getReferenceProps()}>
                                <MdOutlineMoreVert className="scale2"/>
                            </div>
                        </div>
                        <button type="button" className="button-left" onClick={full}>
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
                </form>
            </div>
        }
        
    </>);
};

export default InputComponent;