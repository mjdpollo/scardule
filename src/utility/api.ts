import axios from "axios";
import {getScarTechURL} from "./utility";

export const api = axios.create({
  baseURL: getScarTechURL(),
  withCredentials: true,
});
