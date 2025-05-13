
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

// // const fastMailArr = Array.from(document.querySelectorAll('.cell-logistics-info')).map(item => {
// //     return item.querySelectorAll('li')[2].querySelector('span').textContent.trim()
// // })
// // const skutable = Array.from(document.querySelectorAll('.cell-bor-2')).map(item => {
// //     return item.querySelector('tbody')
// // })

// // console.log(order, fastMailArr, skutable);

// // let searchmap = {}
// // fastMailArr.forEach((item, index) => {
// //     skutable[index].querySelectorAll('tr').forEach(tr => {
// //         console.log(tr);
// //         const sku = tr.querySelectorAll('td')[3]
// //             .textContent.trim()
// //             .replace(/[\s\t\n：]/g, '')
// //             .replace(/[:：]/g, '')
// //         searchmap[`${order}_${sku}`] = item
// //     })
// // })
// // console.log('searchmap', searchmap);

// // Object.keys(searchmap).forEach(key => {
// //     // console.log('key', key);
// //     chrome.storage.local.get([key], function (result) {
// //         console.log('设置', searchmap[key], result, result[key], 'init');
// //         if (result[key] == 'init') {
// //             chrome.storage.local.set({
// //                 [key]: searchmap[key]

// //             })

// //         }
// //     })
// // })

