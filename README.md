# Peakflow for Alpine.js

## Introduction

Peakflow is a powerful Alpine.js plugin that simplifies common workflows for crafting rich, animated experiences on the web.

## Features

### Simplified setup

Instead of repeating `Alpine.data` for every component and `Alpine.store` for everything in your store, Peakflow allows you to use an object like so:

```js
import Alpine from 'alpinejs'
import { peakflow } from 'peakflow'

Alpine.plugin(
  peakflow({
    components: {
      // Define your components here
    },
    store: {
      // Define your store here
    },
  }),
)

Alpine.start()
```

### Enhanced components

In addition to the usual `init` and `destroy` lifecycle methods available within Alpine.js components, Peakflow enhances this further with the following lifecycle events:

| Name           | Description                                             |
| -------------- | ------------------------------------------------------- |
| `resize`       | Runs on window resize                                   |
| `beforeResize` | Runs before resize\*                                    |
| `afterResize`  | Runs after resize\*                                     |
| `raf`          | Animation loop powered by GSAP Ticker. Runs every frame |
| `pointermove`  | Runs on pointermove                                     |

\* _Used rarely, but can come in handy for scheduling complex responsive logic_

Peakflow also adds several dynamic values to the global `$store`:

| Name           | Description                               |
| -------------- | ----------------------------------------- |
| `windowWidth`  | `window.innerWidth`                       |
| `windowHeight` | `window.innerHeight`                      |
| `pointerX`     | X coordinate of pointer (`event.clientX`) |
| `pointerY`     | Y coordinate of pointer (`event.clientY`) |

### Responsive directive

`x-resize` directive for handling simple responsive logic directly in your markup.

### Advanced DOM element selection

Peakflow introduces the `x-array-ref` directive and `$arrayRefs` magic, overcoming the limitation of `x-ref` in selecting multiple elements. This enhancement functions similarly to `x-ref` but returns an array of elements. By assigning the `x-array-ref` attribute with the same identifier (e.g., `foo`) to multiple elements, you can access all these elements as an array through `$arrayRefs.foo`.

## Example

Below is an example of a Peakflow-enhanced Alpine.js component that utilizes the `resize` and `raf` methods, accesses `this.$arrayRefs`, and retrieves window dimensions from `this.$store`.

```html
<div x-data="example">
  <div x-array-ref="items">Item 1</div>
  <div x-array-ref="items">Item 2</div>
  <div x-array-ref="items">Item 3</div>
  <span
    x-text="'Window width: ' + $store.windowWidth + ', Height: ' + $store.windowHeight"
  ></span>
</div>
```

```js
import Alpine from 'alpinejs'
import { peakflow } from 'peakflow'

Alpine.plugin(
  peakflow({
    components: {
      example: () => ({
        init() {
          console.log('Component initialized')
        },
        resize() {
          console.log(
            'Window resized:',
            this.$store.windowWidth,
            this.$store.windowHeight,
          )
        },
        raf() {
          this.$arrayRefs.items.forEach((item, index) => {
            item.style.transform = `translateY(${
              Math.sin(Date.now() / 1000 + index) * 10
            }px)`
          })
        },
      }),
    },
  }),
)

Alpine.start()
```

### Installation

```zsh
npm install peakflow alpinejs
```

## Peer Dependencies

### GSAP

Our library leverages GSAP for its powerful animation capabilities. To use our library, ensure that you have GSAP installed in your project.

**Required Version:** GSAP >= 3.0.0

#### Why GSAP?

We use GSAP's `ticker` for a global animation loop, ensuring smooth and synchronized animations across your application.

#### Installation

Install GSAP using npm:

```zsh
npm install gsap
```
