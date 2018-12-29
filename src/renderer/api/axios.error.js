export const errorMsg = function(code, details) {
  let msg
  switch (code) {
    case 1000:
      msg = '请求路径不存在'
      break
    case 1001:
      msg = '无效的请求令牌（token)'
      break
    case 1002:
      msg = '没有设置令牌'
      break
    case 1003:
      msg = `账号或密码无效`
      break
    case 1004:
      msg = '请求参数不合法'
      break
    case 1005:
      msg = '保存数据错误(有的字段全局唯一，不能重复创建）'
      break
    case 1006:
      msg = '没有操作权限'
      break
    case 1007:
      msg = '有新的版本，请使用新版本'
      break
    case 1008:
      msg = '数据未能通过校验'
      break
    case 2001:
      msg = '操作的资源、对象没有找到'
      break
    case 2002:
      msg = '操作的资源、对象已经存在'
      break
    case 4001:
      msg = '未知错误'
      break
    case 4002:
      msg = '文件太大'
      break
    case 4003:
      msg = '文件保存失败'
      break
    case 4004:
      msg = '无效的图片，该图片没有识别出人脸'
      break
    case 4005:
      msg = '未找到设备'
      break
    case 4006:
      msg = '调用后台服务出错'
      break
    case 4007:
      msg = '用户被限制删除，请你先把该用户从设备中移除'
      break
    default:
      msg = details
  }
  return msg
}
