// 获取对象深层属性
window.Object.prototype.getDeepValue = function(path) { return path.split('.').reduce((val, attr) => { return val ? val[attr] : undefined }, this) }
