import axios from "axios";

export default axios.create({
    baseURL: "https://keep-notes-server-gamma.vercel.app",
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});