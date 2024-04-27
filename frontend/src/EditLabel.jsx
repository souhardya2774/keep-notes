import { Box, Input, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { MdClose ,MdCheck } from "react-icons/md";

import "./EditLabel.css";
import api from './api/api';
import UpdateLabel from "./UpdateLabel";

const style = {
  position: 'absolute',
  top: '25%',
  left: '35%',
  width: 300,
  maxHeight: "50%",
  overflowY: "scroll",
  bgcolor: "white",
  p: 2,
};

const EditLabel=({labels,setLabels,open,setOpen})=> {

  const [newLabel,setNewLabel]= useState("");
  const handleClose=()=>{
    setOpen(false);
    setNewLabel("");
  };

  return (
    <div>
        <Modal
        open={open}
        onClose={handleClose}
        >
          <Box sx={style}>
            <Typography sx={{
              p: 1,
              color: "black",
              fontWeight: 'bold',
            }}>
              Edit labels
            </Typography>
            <form className="labelFormAdd flex" onSubmit={(e)=>{
              e.preventDefault();
              console.log((e.target[1].value.trim()));
              if((e.target[1].value.trim()).length){
                api.post("/labels",{
                  raw_label: (e.target[1].value.trim())
                }).then(res=>{
                  if(res.data.success){
                    setLabels([...labels,res.data.label]);
                  }
                }).catch(err=>console.log(err));
              }
              e.target[1].value="";
            }}>
              <button type="reset" className="btn">
                <MdClose/>
              </button>
              <Input className="input editInput" placeholder="Create new label" aria-label="New label"/>
              <button className="btn">
                <MdCheck/>
              </button>
            </form>
            {
              labels.map((label)=>(
                  <UpdateLabel key={label._id} label={label} labels={labels} setLabels={setLabels}/>
              ))
            }
          </Box>
        </Modal>
    </div>
  );
};

export default EditLabel;