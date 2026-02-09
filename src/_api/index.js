import axios from "axios";
import useUrlStore from "../stores/useUrlStore";

export function getApi() {
  const url = useUrlStore.getState().url;
  // const url = "https://alg.vnet.at.cnl.sk/bestPath/";
  // const url = "https://alg.vnet2.at.cnl.sk/bestPath/";
  // const url = "https://run.mocky.io/v3/5dfddc95-fb4b-42eb-a227-e2cd20fc6a5f";

  return axios.create({
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
}

export default getApi;
