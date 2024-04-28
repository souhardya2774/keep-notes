import axios from "axios";

export default axios.create({
    baseURL: "https://keep-notes-server-gamma.vercel.app",
    withCredentials: true
});