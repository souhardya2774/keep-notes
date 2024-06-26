import { FaGoogle } from "react-icons/fa";
import "./App.css";

const Unauthorized=()=>{
    const google= ()=>{
        window.open("https://keep-notes-server-gamma.vercel.app/auth/google","_self");
    };

    return (
        <div className="notFound">
            <h2>401</h2>
            <p>Unauthorized!</p>
            <button id="loginBtn" className="btn flex" onClick={google}><p>Login with</p> <FaGoogle/></button>
        </div>
    );
};

export default Unauthorized;