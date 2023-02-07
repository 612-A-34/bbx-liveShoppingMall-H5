;(function() {
  const baseSize = 37.5
  function setRem() {
    const scale = document.documentElement.clientWidth / 375 // 750
    document.documentElement.style.fontSize =
      baseSize * Math.min(scale, 2) + 'px'
  }

  window.onresize = function() {
    setRem()
  }
})()
