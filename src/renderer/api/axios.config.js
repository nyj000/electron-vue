import axios from 'axios'
import {Notification} from 'element-ui'
// import { clearCookies } from './cookie.config.js'
import { TIMEOUT, VERSON } from './config'
import { apiList } from './api.list'
import {errorMsg} from './axios.error'
import { readServerConfig, readToken } from 'api/fs.config.js'
const APP_VERSION = require('../../../package.json').version
const APP_ENV = process.platform
// axios.interceptors.request.use((config) => {
//   // Message.info('开始请求!')
//   return config
// }, function (error) {
//   return Promise.reject(error)
// })
// var idCount = 0
// var isHaveId = function (obj) {
//   if (obj instanceof Array) {
//     obj.forEach(item => {
//       isHaveId(item)
//     })
//   } else if (obj instanceof Object) {
//     for (let key in obj) {
//       if (Object.prototype.hasOwnProperty.call(obj, key)) {
//         if (key.indexOf('id') > -1 && key.indexOf('uuid') === -1 && key.indexOf('width') === -1) {
//           idCount++
//           console.error(`find id -- ${key} -- ${idCount}`)
//           console.info(obj)
//         }
//         isHaveId(obj[key])
//       }
//     }
//   }
// }
axios.interceptors.response.use(function (response) {
  let headers = response.headers
  // 带分页的数据从响应头获取分页信息
  let total = headers['x-total-count']
  if (total) {
    response.data.total = total - 0
    response.data.page = headers['x-current-page'] - 0
    response.data.per_page = headers['x-per-page'] - 0
  }
  return response
}, function (err) {
  // 拥有show_error_self 参数代表忽略错误，在调用处处理
  let data = err.config.data || err.config.params
  if (data.show_error_self) {
    return Promise.reject(err)
  }
  // Message.error('请求失败!')
  if (err.response) {
    let code
    let detail
    if (err.response && err.response.data && err.response.data.errors) {
      let error = err.response.data.errors[0] || []
      code = error.code
      detail = error.detail
    }
    let msg
    if (code) {
      msg = errorMsg(code, detail)
    }
    if (msg) {
      let option = {
        duration: 5000,
      }
      let hasDetail = /[\u4e00-\u9fa5]/.test(detail)
      if (hasDetail) {
        // 详情包含中文的显示详情
        option.title = msg
        option.message = detail
      } else {
        option.title = '请求出错'
        option.message = msg
      }
      Notification.error(option)
      console.error(`${msg}：${err.response.config.url}`)
    }
  }
  if (/Network.Error/i.test(err.message) && !window.__newtwork) {
    window.__newtwork = true
    Notification.error({
      title: '连接服务器失败',
      message: '网络错误',
      duration: 5000,
    })
    setTimeout(() => {
      window.__newtwork = false
    }, 2000)
  } else if (/timeout/i.test(err.message) && !window.__timeout) {
    window.__timeout = true
    Notification.error({
      title: '连接服务器失败',
      message: '请求超时',
      duration: 5000,
    })
    setTimeout(() => {
      window.__timeout = false
    }, 2000)
  }
  return Promise.reject(err)
})
// @params 接口名 数据对象 动态参数(可选)
const http = function(key, datas = {}, uuidObj = {}) {
  return new Promise((resolve, reject) => {
    let apiConfig = { ...apiList[key] }
    if (!apiConfig.path) {
      throw new Error(`接口${key}未找到`)
    }
    let data = datas
    let match = apiConfig.path.match(/:[^/]+/g)
    // console.info(111, match, apiConfig)
    if (match) {
      // 动态url获取值
      match.forEach(item => {
        // console.info(222, item)
        let _key = item.replace(':', '')
        let path = apiConfig.path
        if (uuidObj[_key]) {
          path = path.replace(item, uuidObj[_key])
          apiConfig.path = path
        } else if (data[_key]) {
          path = path.replace(item, data[_key])
          apiConfig.path = path
          delete data[_key]
        } else {
          throw new Error(_key + ' 值是必传的 接口名: ' + key)
        }
      })
    }
    let config = {
      method: apiConfig.method,
      timeout: TIMEOUT,
      headers: {
        // Authorization: 'Bearer 12345678',
        // Authorization: `Bearer ${taoken.TOKEN}`,
      }
    }
    // 避免headers冲突
    // if (apiConfig.options) {
    //   config.headers = Object.assign(config.headers, apiConfig.options.headers)
    //   delete apiConfig.options.headers
    // }
    // console.log('data', datas)
    // console.log(Object.assign(config, apiConfig.options))
    let configs = {...config, ...apiConfig.options}
    if (/post|put/i.test(apiConfig.method)) {
      // 全部使用form表单的格式提交
      if (!configs['Content-Type']) {
        configs['Content-Type'] = 'application/x-www-form-urlencoded '
        let formData = new FormData()
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            formData.append(key, data[key])
          }
        }
        configs.data = formData
      } else {
        configs.data = data
      }
      // 添加版本号
      configs.data.append('app_version', APP_VERSION)
      // 添加软件运行的系统环境
      configs.data.append('os', APP_ENV)
      // 添加請求來源信息
      configs.data.append('channel', 'web_app')
    } else if (/get|delete/i.test(apiConfig.method)) {
      // 添加版本号
      data.app_version = APP_VERSION
      // 添加软件运行的系统环境
      data.os = APP_ENV
      // 添加請求來源信息
      data.channel = 'web_app'
      configs.params = data
    }
    readServerConfig().then((obj) => {
      let SERVER_URL = `http://${obj.ip}:${obj.port}`
      configs.url = `${apiConfig.baseUrl || SERVER_URL}/${VERSON}/${apiConfig.path}`
      if (key === 'login') {
        axios(configs).then(resolve).catch(reject)
        return
      }
      readToken().then((TOKEN) => {
        configs.headers.Authorization = `Bearer ${TOKEN}`
        axios(configs).then(resolve).catch(reject)
      }).catch(() => {
        reject(new Error('读取用户token失败'))
      })
    }).catch(() => {
      reject(new Error('读取服务器信息失败'))
    })
  })
}
export default http
