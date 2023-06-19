import axios from "axios";

export const instance = axios.create({
  baseURL: 'https://run.mocky.io/v3',

});
