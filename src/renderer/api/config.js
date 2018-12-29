
export const TIMEOUT = 15000
export const VERSON = 'v1'
export const env = process.env.NODE_ENV || 'development'
// const env = 'production'  // 在家用
// 114.80.100.145:3030    Authorization token:Bearer 12345678
let VSERVER_URL = ''
let VNODE_SERVER = ''

if (env === 'development') {
  VSERVER_URL = 'http://10.1.2.132:3030' // 局域网
  // VSERVER_URL = 'http://114.80.100.145:3030'
  VNODE_SERVER = 'http://localhost:8888'
} else if (env === 'staging') {
  // VSERVER_URL = 'http://114.80.100.145:3030'
} else if (env === 'production') {
  VSERVER_URL = ''
}
export const NODE_SERVER = VNODE_SERVER
export const SERVER_URL = VSERVER_URL
// 密码加密前缀
export const PREX = 'BIG'
