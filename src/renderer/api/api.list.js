//  method, url , baseUrl(可选), options(请求头配置，可选)
export const apiList = {
  /**
   * 管理员登录登出
   * */
  // 登陆
  login: { method: 'POST', path: 'api/sign_in' },
  // 人脸、活体检测
  face_detection: { method: 'POST', path: 'api/faces/detection', options: { 'Content-Type': 'multipart/form-data' } },
}
