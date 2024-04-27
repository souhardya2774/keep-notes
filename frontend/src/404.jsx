import { Link } from "react-router-dom";

import "./App.css";

const Page=()=>{
    return (
        <div className="notFound">
            <h2>404</h2>
            <p>Page not found!</p>
            <p>Back to <Link id="homeLink" to="/">Home page</Link>.</p>
        </div>
    );
};

export default Page;