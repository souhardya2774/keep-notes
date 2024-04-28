import { NavLink } from "react-router-dom";

import { MdLightbulbOutline, MdNotificationsNone, MdLabelOutline, MdOutlineEdit, MdOutlineArchive, MdDeleteOutline } from "react-icons/md";

import "./Menu.css";

const SideBar=({labels,activeSidebar,open,setOpen})=>{
    return (<>
        <div id="sideBarDiv" className={(!activeSidebar)?"disabled":""}>
            <ul>
                <li key={"notes"}>
                    <NavLink to="/" className={({isActive})=>
                        [
                            "menu",
                            isActive ? "active" : ""
                        ].join(" ")
                    }>
                        <MdLightbulbOutline className="scale1 menuIcon"/>
                        <span>Notes</span>
                    </NavLink>
                </li>
                    {
                        labels.map((label)=>
                        <li key={label._id}>
                            <NavLink to={`/labels/${label._id}`} className={({isActive})=>
                                [
                                    "menu",
                                    isActive ? "active" : ""
                                ].join(" ")
                            }>
                                <MdLabelOutline className="scale1 menuIcon"/>
                                <span>{((label.name).length>10)?(label.name.slice(0,10))+"...":label.name}</span>
                            </NavLink>
                        </li>
                        )
                    }
                <li key="edit_labels">
                    <div className="menu" onClick={(e)=>setOpen(true)}>
                        <MdOutlineEdit className="scale1 menuIcon"/>
                        <span>Edit labels</span>
                    </div>
                </li>
                <li key="archived">
                    <NavLink to="archived" className={({isActive})=>
                        [
                            "menu",
                            isActive ? "active" : ""
                        ].join(" ")
                    }>
                        <MdOutlineArchive className="scale1 menuIcon"/>
                        <span>Archives</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    </>);
};

export default SideBar;