
const formart = {
  formatTime(time, format) {
    if (!time) {
      return ''
    }
    const TOTOW = e => `0${e}`.substr(-2)
    const date = new Date(time)
    const yyyy = date.getFullYear()
    const MM = TOTOW(date.getMonth() + 1)
    const dd = TOTOW(date.getDate())
    const hh = TOTOW(date.getHours())
    const mm = TOTOW(date.getMinutes())
    const ss = TOTOW(date.getSeconds())
    let result
    if (format) {
      result = format.replace(/yyyy/i, yyyy).replace(/MM/, MM).replace(/dd/i, dd).replace(/hh/i, hh).replace(/mm/, mm).replace(/ss/i, ss)
    } else {
      result = `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`
    }
    return result
  },
  formartNum(num) {
    if (!/string|number/.test(typeof num)) {
      return num
    }
    let before = num < 0 ? '-' : ''
    let result = Math.abs(num)
    result = result.toString()
    let after = result.split('.')[1] || ''
    result = result.split('.')[0]
    result = result.split('').reverse()
    result = Array.from(result, (item, index) => index % 3 === 2 ? `,${item}` : item)
    result = result.reverse()
    result = result.join('')
    if (result[0] === ',') {
      result = result.substr(1)
    }
    result = `${before}${result}${after ? '.' : ''}${after}`
    return result
  },
  extend(arr, obj) {
    if (!(arr instanceof Array)) {
      throw new Error('@params1 继承的属性对象类型必须是 Array')
    } else if (!(obj instanceof Object)) {
      throw new Error('@params2 被继承的对象类型必须是 Object')
    }
    let newObj = {}
    arr.forEach(key => {
      if (typeof key === 'string') {
        newObj[key] = obj[key]
      }
    })
    return newObj
  },
}
export default formart
