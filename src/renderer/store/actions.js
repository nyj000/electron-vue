import axios from 'axios'
import { NODE_SERVER, TIMEOUT } from '../api/config'
export default {
  updateUserInfo: (store, data) => {
    axios({
      method: 'POST',
      timeout: TIMEOUT,
      url: `${NODE_SERVER}/api/user/getUserInfo`,
      contentType: 'application/json',
      data
    }).then(res => {
      if (res.data && res.data.code === '200') {
        store.commit('setUserInfo', res.data.data)
      } else {
        // 5秒后重试
        // setTimeout(() => {
        //   store.dispatch('updateUserinfo', data)
        // }, 5000)
      }
    }).catch(() => {
      // setTimeout(() => {
      //   store.dispatch('updateUserinfo', data)
      // }, 5000)
    })
  }
}
