// Api.js
import axios from 'axios'

interface Response{
  code:number,
  message: string,
  data:object
}

// Create a instance of axios to use the same base url.
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
const axiosAPI = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
})



// implement a method to execute all the request from here.
// ヘッダを共通化したいので，axiosAPIを包むapiRequest関数を定義．ヘッダがいらないとなったらこの関数は不要．
const apiRequest = (method, real_url, request, headers?) => {
  //using the axios instance to perform the request that received from each http method
  return axiosAPI({
    method,
    url : 'https://n2-cors-anywhere.herokuapp.com/'+ real_url,
    data: request,
    headers : headers
  })
    .then((res) => {
      return Promise.resolve(res.data)
      
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}

// function to execute the http get request
const get = async (url, request?, headers?) => {
  let res = await apiRequest('get', url, request, headers)
  return res
}

// function to execute the http delete request
//  const deleteRequest = (url, request) => apiRequest('delete', url, request)

// function to execute the http post request
const post = async (url, request,  headers?) => {
  let res= await apiRequest('post', url, request, headers)
  return res
}

// function to execute the http put request
const put = async (url, request,  headers?) => {
  let res = await apiRequest('put', url, request,  headers)
  return res.data
}

// function to execute the http path request
//  const patch = (url, request) => apiRequest('patch', url, request)

// expose your method to other services or actions
const Api = {
  get,
  //delete: deleteRequest,
  post,
  put,
  //patch
}
export default Api
