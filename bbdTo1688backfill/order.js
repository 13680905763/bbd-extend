

const order = document.querySelectorAll('.cell-order-info li')[0].textContent.trim().split('：')[1]
const fastMailArr = Array.from(document.querySelectorAll('.cell-logistics-info')).map(item => {
    return item.querySelectorAll('li')[2].querySelector('span').textContent.trim()
})
const skutable = Array.from(document.querySelectorAll('.cell-bor-2')).map(item => {
    return item.querySelector('tbody')
})

console.log(order, fastMailArr, skutable);

let searchmap = {}
fastMailArr.forEach((item, index) => {
    skutable[index].querySelectorAll('tr').forEach(tr => {
        console.log(tr);
        const sku = tr.querySelectorAll('td')[3]
            .textContent.trim()
            .replace(/[\s\t\n：]/g, '')
            .replace(/[:：]/g, '')
        searchmap[`${order}_${sku}`] = item
    })
})
console.log('searchmap', searchmap);

Object.keys(searchmap).forEach(key => {
    // console.log('key', key);
    chrome.storage.local.get([key], function (result) {
        console.log('设置', searchmap[key], result, result[key], 'init');
        if (result[key] == 'init') {
            chrome.storage.local.set({
                [key]: searchmap[key]

            })

        }
    })
})

