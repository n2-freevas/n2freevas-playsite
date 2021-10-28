// Api.js
import axios from 'axios'


function switchBaseURL() {
  //return 'http://127.0.0.1:8000/api'
  return 'https://n2freevas-api.herokuapp.com/api'
}

// Create a instance of axios to use the same base url.
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
const axiosAPI = axios.create({
  baseURL: switchBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
})
// implement a method to execute all the request from here.
// ヘッダを共通化したいので，axiosAPIを包むapiRequest関数を定義．ヘッダがいらないとなったらこの関数は不要．
// const apiRequest = (method, real_url, request, headers?) => {
//   //using the axios instance to perform the request that received from each http method
//   return axiosAPI({
//     method,
//     url : 'https://n2-cors-anywhere.herokuapp.com/'+ real_url,
//     data: request,
//     headers : headers
//   })
//     .then((res) => {
//       return Promise.resolve(res.data)
      
//     })
//     .catch((err) => {
//       return Promise.reject(err)
//     })
// }


const get = async (url, request?) => {
  const res = await axiosAPI.get(url, { params: request })
  return res.data
}

const post = async (url, request) => {
  const res = await axiosAPI.post(url, request)
  return res.data
}


const Api = {
  get,
  post
}
export default Api
