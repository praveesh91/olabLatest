import axios from "axios";
import { isPublicUrl } from "../services/common.services";

const requestMiddleware = () => {
    axios.interceptors.request.use((config:any) => {
        config.url = decodeURIComponent(config.url);
        const token = localStorage.getItem("token") || null;
        if (token && !isPublicUrl(config.url)) {
            config["headers"]["Authorization"] = "Token " + JSON.parse(token);
        }
        return config;
    });
};

export default requestMiddleware;
