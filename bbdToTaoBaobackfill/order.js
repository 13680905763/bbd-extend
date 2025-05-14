
// const params = new URLSearchParams(window.location.search)
// const key = params.get('key')
// const order = key.split('_')[0]
// const sku = key.split('_')[1]
// console.log(order, sku);

// function simulateWeidianSearch(keyword) {
//     const input = document.querySelector('form input[type="search"]')
//     if (!input) return

//     // React/Vue 受控组件兼容设置值
//     const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
//     nativeInputValueSetter.call(input, keyword)

//     // 触发 input 事件（框架监听的）
//     input.dispatchEvent(new Event('input', { bubbles: true }))

//     const form = document.querySelector('form')
//     setTimeout(() => {
//         form.dispatchEvent(new Event('submit', { bubbles: true }))
//     }, 1000)
// }



// setTimeout(() => {
//     simulateWeidianSearch(order)
//     console.log(6666);
// }, 1000)


