import { IoMdTrash } from "react-icons/io";
import { MdCheck } from "react-icons/md";
import { Input } from "@mui/material";

import api from './api/api';
import { useState } from "react";

const UpdateLabel=({label,labels,setLabels})=>{
    const deleteLabel=()=>{
        api.delete(`/labels/${label._id}`)
            .then(res=>{
                if(res.data.success){
                    setLabels(labels.filter(labelL=>(labelL._id!==label._id)));
                }
            })
            .catch(err=>console.log(err));
    };

    const previous= label.name;
    const [value,setValue]= useState(label.name);

    const updateLabel=()=>{
        if((value.trim()).length){
            api.put(`/labels/edit/${label._id}`,{
                labelName: value.trim()
            }).then(res=>{
                if(res.data.success){
                    setLabels(labels.map(labelL=>(labelL._id===label._id)?{
                        ...labelL,
                        name: value.trim()
                    }:labelL));
                }
            })
            .catch(err=>console.log(err));
        }
    };

    return (
    <>
    <form className="labelForm flex" onSubmit={(e)=>{
        e.preventDefault();
        if(previous!==value){
            updateLabel();
        }
    }}>
        <button type="button" className="btn" onClick={deleteLabel}>
            <IoMdTrash/>
        </button>
        <Input className="input updateInput" placeholder="Update label" aria-label="Update label" value={value} onChange={(e)=>setValue(e.target.value)}/>
        <button className="btn" type="submit">
            <MdCheck/>
        </button>
    </form>
    {(previous!==value) && <p style={{fontSize:"small",color:"red"}}>*Above updated label name haven't been saved</p>}
    </>
    );
};

export default UpdateLabel;