// Api.js
import { ENV_N2FREEVAS_API_DOMAIN, ENV_N2FREEVAS_API_KEY } from '$lib/K/env'
import axios from 'axios'

// Create a instance of axios to use the same base url.
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
const n2AxiosInstance = axios.create({
    baseURL: ENV_N2FREEVAS_API_DOMAIN,
    headers: {
        'authorization': ENV_N2FREEVAS_API_KEY,
        'other-authorization': "",
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
})

const normalAxiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
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
n2AxiosInstance.interceptors.response.use(
    function (response) {
      // 成功時200系
      return response
    },
    function (error) {
      // 400, 422, それ以外(500)はこっち
      switch (error.response?.status) {
            case 400:
                //案1 レスポンス内容を投げて,.svelteファイルにやらせる
                // throw error.response?
                //案2 レスポンスのdetailを投げて、.svelteファイルにやらせる
                // throw error.response?.data.detail
                //案3 ここでToastを発生させて、.svelteファイルは何もせんでいい
                console.error(`N2API_ERROR_CODE: ${error.response?.data.detail}`)
                break
            case 401:
                console.error(`N2API_ERROR_CODE: ${error.response?.data.detail}`)
                break
            case 422:
                console.error(`N2API_ERROR_CODE: ${error.response?.data.detail}`)
                break
            default:
                console.error(`N2API_ERROR_CODE: ${error.response?.data.detail}`)
                break
        }
        throw error.response?.data.detail
    }
  )

export const N2API_ERROR_CODE = {
    ACCESS_INVALID: "ACCESS_INVALID"
}

const get = async (url, request?, other_authorization?:string) => {
    if(other_authorization){
        n2AxiosInstance.defaults.headers["other-authorization"] = other_authorization
    }    
    const res = await n2AxiosInstance.get(url, { params: request })
    return res.data
}

const post = async (url, request) => {
    const res = await n2AxiosInstance.post(url, request)
    return res.data
}

const n_get = async (url, request?) => {
    const res = await normalAxiosInstance.get(url, { params: request })
    return res.data
}

const n_post = async (url, request) => {
    const res = await normalAxiosInstance.post(url, request)
    return res.data
}

const Api = {
    get,
    post,
    n_get,
    n_post
}
export default Api
