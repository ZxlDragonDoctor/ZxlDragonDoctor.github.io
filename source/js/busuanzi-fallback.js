// 不蒜子取数接口故障时，用「统计暂不可用」代替一直转圈；接口恢复后数字会自动回填。
(() => {
  const IDS = ['busuanzi_value_site_uv', 'busuanzi_value_site_pv', 'busuanzi_value_page_pv']
  const TIMEOUT = 10000
  const MAX_WAIT = 120000
  const TEXT = '统计暂不可用'
  let timer

  const mark = (el, unavailable) => {
    el.classList.toggle('bsz-unavailable', unavailable)
    if (unavailable) el.textContent = TEXT
  }

  const watch = () => {
    const start = Date.now()
    clearInterval(timer)
    timer = setInterval(() => {
      const elapsed = Date.now() - start
      IDS.forEach(id => {
        const el = document.getElementById(id)
        if (!el) return
        if (/\d/.test(el.textContent)) mark(el, false)
        else if (elapsed > TIMEOUT) mark(el, true)
      })
      if (elapsed > MAX_WAIT) clearInterval(timer)
    }, 500)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watch)
  } else {
    watch()
  }
  document.addEventListener('pjax:complete', watch)
})()
