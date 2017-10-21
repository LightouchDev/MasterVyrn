'use strict'

;(() => {
  window.addEventListener('DOMContentLoaded', () => {
    cssOverride()
    windowResizer()
    // windowResizeInject()
  })

  function cssOverride () {
    /**
     * Inject css rule to head
     */
    let cssContent = require('fs').readFileSync(require('path').join(__dirname, 'override.css'), 'utf8')
    let cssOverride = document.createElement('style')
    cssOverride.appendChild(document.createTextNode(cssContent))
    document.head.appendChild(cssOverride)
  }

  function windowResizer () {
    /**
     * resize window asap
     */
    setInterval(() => {
      document.getElementById(window.Game.gameContainer.id).style.zoom = window.innerWidth / 320
    }, 0)
  }

  function windowResizeInject () {
    /**
     * Make size button can change window size
     * FIXME: NOT IMPLEMENT
     */
    let resizeBtn = document.getElementsByClassName('btn-pc-footer-setting')
    for (let index in resizeBtn) {
      if (resizeBtn.hasOwnProperty(index)) {
        resizeBtn[index].addEventListener('click', (evt) => {
          window.alert('Zoom:' + (evt.target.dataset.size * 0.5 + 1) * 320)
        })
      }
    }
  }
})()
