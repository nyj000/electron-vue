export default {
  setUserInfo(state, data) {
    state.user_info = data
    // localStorage.setItem('userInfo', JSON.stringify(data))
  },
}
