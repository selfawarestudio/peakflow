import gsap from 'gsap'
import { smitter } from 'smitter'
import debounce from 'just-debounce-it'

const isFunction = (fn) => typeof fn === 'function'

export const peakflow = ({ components = {}, store = {} }) => {
  const { emit, on } = smitter()

  return (Alpine) => {
    Alpine.magic('rect', (el) => {
      const getRect = (el) => el?.getBoundingClientRect?.()
      const rect = getRect(el)

      if (rect) {
        getRect.width = rect.width
        getRect.height = rect.height
        getRect.top = rect.top
        getRect.right = rect.right
        getRect.bottom = rect.bottom
        getRect.left = rect.left
        getRect.x = rect.x
        getRect.y = rect.y
      }

      return getRect
    })

    Object.entries(store).forEach(([key, value]) => Alpine.store(key, value))

    resize()
    window.addEventListener('resize', debounce(resize, 150))
    function resize() {
      Alpine.store('windowWidth', window.innerWidth)
      Alpine.store('windowHeight', window.innerHeight)
      emit('beforeResize')
      emit('resize')
      emit('afterResize')
    }

    document.addEventListener('pointermove', pointermove)
    function pointermove(ev) {
      Alpine.store('pointerX', ev.clientX)
      Alpine.store('pointerY', ev.clientY)
      emit('pointermove')
    }

    Alpine.directive(
      'resize',
      (_el, { expression }, { evaluateLater, effect, cleanup }) => {
        const handler = evaluateLater(expression)

        let off = () => {}

        effect(() => {
          off = on('resize', handler)
          handler()
        })

        cleanup(() => off())
      },
    )

    Object.entries(components).forEach(([name, create]) => {
      Alpine.data(name, () => {
        const instance = create.call(this)

        return {
          ...instance,
          init() {
            this.$arrayRefs = {}

            walk(
              this.$root,
              (el, next, first) => {
                if (el.hasAttributes()) {
                  for (const { name, value } of el.attributes) {
                    if (name === 'x-array-ref' && !first) {
                      this.$arrayRefs[value] = (
                        this.$arrayRefs[value] || []
                      ).concat(el)
                    }
                  }
                }
                next()
              },
              true,
            )

            if (isFunction(instance.init)) {
              instance.init.call(this)
            }

            if (isFunction(instance.beforeResize)) {
              this._offBeforeResize = on(
                'beforeResize',
                instance.beforeResize.bind(this),
              )
              instance.beforeResize.call(this)
            }

            if (isFunction(instance.resize)) {
              this._offResize = on('resize', instance.resize.bind(this))
              instance.resize.call(this)
            }

            if (isFunction(instance.afterResize)) {
              this._offAfterResize = on(
                'afterResize',
                instance.afterResize.bind(this),
              )
              instance.afterResize.call(this)
            }

            if (isFunction(instance.pointermove)) {
              this._offPointermove = on(
                'pointermove',
                instance.pointermove.bind(this),
              )
            }

            if (isFunction(instance.raf)) {
              this._raf = instance.raf.bind(this)
              gsap.ticker.add(this._raf)
            }
          },
          destroy() {
            if (this._offBeforeResize) {
              this._offBeforeResize()
            }

            if (this._offResize) {
              this._offResize()
            }

            if (this._offAfterResize) {
              this._offAfterResize()
            }

            if (this._offPointermove) {
              this._offPointermove()
            }

            if (this._raf) {
              gsap.ticker.remove(this._raf)
            }

            if (isFunction(instance.destroy)) {
              instance.destroy.call(this)
            }
          },
        }
      })
    })
  }
}

function walk(el, callback, first = false) {
  callback(
    el,
    () => {
      let node = el.firstElementChild
      while (node) {
        walk(node, callback)
        node = node.nextElementSibling
      }
    },
    first,
  )
}
