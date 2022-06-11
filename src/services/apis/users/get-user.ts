import axios from "axios";

export const getUser = () => {
  let url = "https://inventory-dev-295903.appspot.com/";

  return axios.get(url).then();
};
