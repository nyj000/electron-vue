(function flexible (window, document) {
  var dpr = window.devicePixelRatio || 1
  if (dpr === 2) {
    dpr = 2
  } else if (dpr >= 3) {
    dpr = 3
  } else {
    dpr = 1
  }
  document.body.setAttribute('data-dpr', dpr)
}(window, document))
