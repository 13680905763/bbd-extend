const params = new URLSearchParams(window.location.search)
const order = params.get('order')
const goodname = params.get('goodname')
const sku = params.get('sku')
const key = `${order}_${goodname}_${sku}`
console.log('key', key);

const input = document.querySelector('.Filter--inputId--JmjL4fX').querySelector('input')
const btn = document.querySelector('form button')
console.log(input, btn);


const interval = setInterval(() => {
    // 监听table加载
    const table = document.querySelector('.Table--orderItemWraper--vfIxDrh')
    if (table) {
        clearInterval(interval)
        // 填充输入框的值
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
        setter.call(input, order)  // 输入关键词
        input.dispatchEvent(new Event('input', { bubbles: true }))
        btn.click()
        getData()
    }
}, 1000);

function getData() {
    const interval = setInterval(() => {
        // 监听table加载
        const table = document.querySelector('.Table--orderItemWraper--vfIxDrh')
        // console.log(table);
        if (table) {
            clearInterval(interval)
            // 获取更多
            const btn = document.querySelector('.LoadMore--loadMore--gVFbml7 button')
            btn?.click()
            if (btn) {
                getData()
            } else {
                console.log('没有更多了');
                const goodItems = Array.from(document.querySelectorAll('.Content--colStatus--F9DfIjZ')).filter(item => {
                    return item.querySelector('.Section--colStatus--AZq0YyG').textContent !== '待发货'
                })
                console.log('goodItems:', goodItems);
                try {
                    goodItems.forEach(item => {
                        const wrp = item.querySelector('.ProductCard--imgWrapper--LOE0M2H').querySelector('div')
                        // console.log(666, wrp.querySelectorAll('div'));

                        const itemgoodName = wrp.querySelectorAll('div')[0].querySelector('span').textContent
                        const itemsku = wrp.querySelectorAll('div')[3].querySelector('span').textContent
                        const itemorder = wrp.querySelectorAll('div')[9].textContent.split(':')[1].replace(/[\s\t\n：]/g, '')
                        const isSku = sku.split(';').filter(item => {
                            return itemsku.includes(item)
                        }).length == sku.split(';').length

                        const fastMail = item.querySelector('.Content--inlineCopy--K37VC0Q').textContent.replace(/[\s\t\n：]/g, '')

                        // console.log('itemgoodName:', itemgoodName == goodname, 'itemsku:', isSku, 'itemorder:', itemorder == order);
                        if (itemgoodName == goodname && itemorder == order && isSku) {
                            console.log('订单名字sku都相同');
                            console.log('fastMail:', fastMail);
                            chrome.storage.local.set({ [key]: fastMail }, () => {
                                console.log(`${key} 设置成功`);
                            });

                        } else {
                            console.log('未找到');

                        }
                    })
                } catch (error) {
                    console.log(error);

                }

            }
        }
    }, 1000);
}
// const fastMail = document.querySelector('.detail').querySelectorAll('.item')[2].textContent.split(':')[1].replace(/[\s\t\n：]/g, '')





