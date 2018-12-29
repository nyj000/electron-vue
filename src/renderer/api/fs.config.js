import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

const db = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/data.db')
})

let config = {}
// 读取配置
function readFile(key) {
  return new Promise((resolve, reject) => {
    db.findOne({
      _id: 'user-config'
    }, (error, ret) => {
      // console.log(111, error, ret)
      if (error) {
        reject(error)
      }
      let data = ret || {}
      // 第一次进入创建数据
      if (!ret) {
        db.insert({
          _id: 'user-config',
          TOKEN: '',
          SERVER: '',
        })
      }
      config = data
      resolve(data[key])
    })
  })
}
readFile().then().catch()
// 写入配置
function writeFile(key, value) {
  return new Promise((resolve, reject) => {
    config[key] = value
    let data = {}
    data[key] = value
    // 更新单项
    db.update({
      _id: 'user-config'
    }, {
      $set: data
    }, (error, ret) => {
      // console.log(222, error, ret)
      if (error) {
        reject(error)
      }
      resolve({
        status: 'ok'
      })
    })
  })
}
// 读取用户token
export const readToken = function () {
  return new Promise((resolve, reject) => {
    // 避免反复读取文件
    if (config && config.TOKEN) {
      resolve(config.TOKEN)
    } else {
      readFile('TOKEN').then((data) => {
        resolve(data)
      }).catch((err) => {
        reject(err)
      })
    }
  })
}

// 写入用户token
export const writeToken = function (text) {
  return new Promise((resolve, reject) => {
    writeFile('TOKEN', text).then((data) => {
      resolve(data)
    }).catch((err) => {
      reject(err)
    })
  })
}

// 读取服务器配置
export const readServerConfig = function () {
  return new Promise((resolve, reject) => {
    // 避免反复读取文件
    if (config && config.SERVER) {
      resolve(config.SERVER)
    } else {
      readFile('SERVER').then((data) => {
        resolve(data || {})
      }).catch((err) => {
        reject(err)
      })
    }
  })
}

// 保存服务器配置
export const writeServerConfig = function (obj) {
  return new Promise((resolve, reject) => {
    writeFile('SERVER', obj).then((data) => {
      resolve(data)
    }).catch((err) => {
      reject(err)
    })
    writeFile('TOKEN', '').then((data) => {
    }).catch(() => {
    })
  })
}

/**
 * 读取群组、设备、用户列表第一页信息
 * */
export const getFirstPageList = function (keys) {
  if (!/^(persons?_list|groups_list|devices_list)$/i.test(keys)) {
    throw new Error('params is must be person_list or groups_list or devices_list')
  }
  let key = keys
  if (keys === 'persons_list') {
    key = 'person_list'
  }
  let data = window.localStorage.getItem(`__${key}`)
  data = data ? JSON.parse(data) : []
  return data
}

// 设置群组、设备、用户列表第一页信息
export const setFirstPageList = function (keys, list) {
  if (!/^(person_list|groups_list|devices_list)$/i.test(keys)) {
    throw new Error('params is must be person_list or groups_list or devices_list')
  } else if (!(list instanceof Array)) {
    throw new Error(`the value of ${keys} must be a Array`)
  }
  let key = keys
  if (keys === 'persons_list') {
    key = 'person_list'
  }
  window.localStorage.setItem(`__${key}`, JSON.stringify(list))
}
