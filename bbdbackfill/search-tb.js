try {
    const params = new URLSearchParams(window.location.search)
    const order = params.get('order')
    const goodname = params.get('goodname')
    const sku = params.get('sku')
    const type = params.get('type')
    const key = `${order}_${goodname}_${sku}_${type}`
    console.log('key', key);

    const input = document.querySelector('.Filter--inputId--JmjL4fX').querySelector('input')
    const btn = document.querySelector('form button')
    console.log(input, btn);

    const intervalInit = setInterval(() => {
        // 监听table加载
        const table = document.querySelector('.Table--orderItemWraper--vfIxDrh')
        if (table) {
            clearInterval(intervalInit)
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
                    // console.log('没有更多了');
                    const goodItems = Array.from(document.querySelectorAll('.Content--colStatus--F9DfIjZ')).filter(item => {
                        return item.querySelector('.Section--colStatus--AZq0YyG').textContent.includes('已发货')
                    })
                    // console.log('goodItems:', goodItems);
                    try {
                        goodItems.forEach(item => {
                            const wrp = item.querySelector('.ProductCard--imgWrapper--LOE0M2H').querySelector('div')

                            const fastMail = item.querySelector('.Content--inlineCopy--K37VC0Q').textContent.replace(/[\s\t\n：]/g, '')
                            const pagegoodname = wrp.querySelectorAll('div')[0].querySelector('span').textContent
                            const pagesku = wrp.querySelectorAll('div')[3].querySelector('span').textContent
                            const pageorder = wrp.querySelectorAll('div')[9].textContent.split(':')[1].replace(/[\s\t\n：]/g, '')

                            const isgoodname = goodname.split('').filter(item => {
                                return pagegoodname.includes(item)
                            }).length == goodname.split('').length
                            const issku = sku.split('').filter(item => {
                                return pagesku.includes(item)
                            }).length == sku.split('').length
                            const isorder = order == pageorder
                            // console.log(isgoodname, issku, isorder);
                            if (isorder && isgoodname && issku) {
                                console.log('抓取到快递单号', fastMail);
                                chrome.storage.local.set({ [key]: fastMail })
                            }
                            else {
                                console.log('未找到订单号~~~~~~');
                            }
                        })
                    } catch (error) {
                        console.log(error);

                    }

                }
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(interval)
        }, 10000);
    }

} catch (error) {
    console.log(error);

}




