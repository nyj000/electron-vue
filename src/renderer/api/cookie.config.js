import * as Cookies from 'js-cookie'

function getRootDomain() {
  let domain = document.domain
  const domainArr = domain.split('.')
  const arrLen = domainArr.length
  if (arrLen > 2) {
    domain = domainArr[arrLen - 2] + '.' + domainArr[arrLen - 1]
  }
  return domain
}

export function getCookie(key = 'yk_union') {
  return Cookies.get(key, { domain: getRootDomain() })
}

export function clearCookies() {
  const rootDomain = getRootDomain()
  Cookies.remove('yk_union', { domain: rootDomain })
  // 以下操作兼容发布app
  Cookies.remove('yk_uid', { domain: rootDomain })
  Cookies.remove('yk_username', { domain: rootDomain })
  Cookies.remove('brand_profile', { domain: rootDomain })
  Cookies.remove('customer_entities', { domain: rootDomain })
}

// 批量设置
export function setCookies(data) {
  const rootDomain = getRootDomain()
  Cookies.set('yk_union', data.user.private_token, { domain: rootDomain })
  // // 以下操作兼容发布app
  // Cookies.set('yk_role', 'brand', {domain: rootDomain})
  Cookies.set('yk_uid', data.user.id, { domain: rootDomain })
  Cookies.set('yk_username', data.user.nickname, { domain: rootDomain })
  if (data.user.customer_entities.length > 0) {
    Cookies.set('customer_entities', JSON.stringify(data.user.customer_entities), { domain: rootDomain })
  }
  Cookies.set('brand_profile', JSON.stringify(data.user), { domain: rootDomain })
}
