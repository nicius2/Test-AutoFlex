import axios from "axios";
import { env } from "../env";

export const http = axios.create({
     baseURL: env.VITE_BASE_URL,
     headers: {
          "Content-Type": "application/json",
     },
});

