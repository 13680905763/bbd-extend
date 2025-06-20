
try {
    // 获取url
    const url = window.location.href;
    console.log(url);

    const iframes = document.querySelectorAll('iframe');
    const iframe = iframes[iframes.length - 1];
    // console.log(iframe);

    if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        // 获取iframe中的元素

        // 筛选商家
        let titleindex
        let numIndex
        const titles = Array.from(iframeDocument.querySelectorAll('th[data-field]'))
        console.log(titles);
        titles.forEach((item, index) => {
            if (item.dataset.field == 'goodsseller') {
                titleindex = index
            }
            if (item.dataset.field == 'goodsnum') {
                numIndex = index
            }
        })


        const goodlists = Array.from(iframeDocument.querySelectorAll('tr[data-index]')).filter(item => {
            const td = item.querySelectorAll('td')
            if (td[titleindex].textContent === 'zzztop' || td[titleindex].textContent === 'Hello Kitty品牌童装店') {
                return false
            }
            return true
        }).map(item => {
            console.log(item);
            const newItem ={
                details: item.querySelector('.goodsname'),
                goodNum: item.querySelectorAll('td')[numIndex].textContent
            }
            return newItem
        }).filter(item =>
            item.details.querySelector('a').href.includes('taobao.com/')
        ).reverse();
        console.log('goodlists',goodlists);

        if (goodlists.length > 0) {
            // 设置待购数量
            chrome.storage.local.set({ goodlength: goodlists.length })
            // 设置购买状态
            chrome.storage.local.set({ isbuy: 0 })

            const autoBuy = setInterval(() => {
                console.log('持续购买中~~~');
                // 购买状态为 0 时 执行购买操作
                chrome.storage.local.get('isbuy', (result) => {
                    // console.log(!result.isbuy);
                    if (!result.isbuy) {
                        chrome.storage.local.get('goodlength', (result) => {
                            if (result.goodlength) {
                                // 获取购买类型

                                const goodTypeArr = goodlists[result.goodlength - 1].details
                                    .querySelectorAll('small')[url.includes('https://bbdbuy.com/admin/order/goods') ? 1 : 0]
                                    .innerHTML.split('<br>')
                                    .map((item) => {
                                        item.split(':')
                                        return item.split(':')[1]
                                    })

                                chrome.storage.local.set({ goodTypeArr: goodTypeArr }, () => {
                                    console.log('购买类型设置完毕', goodTypeArr);
                                })
                                chrome.storage.local.set({ goodNum: goodlists[result.goodlength - 1]['goodNum'] }, () => {
                                    console.log('购买数量设置完毕', goodTypeArr);
                                })

                                // 跳转到购买链接
                                goodlists[result.goodlength - 1].details.querySelector('a').click()
                            }
                        })

                    }
                })
                chrome.storage.local.get('goodlength', (result) => {
                    if (result.goodlength == 0) {
                        alert('采购完成')
                        clearInterval(autoBuy)
                    }
                })
            }, 3000);
        } else {
            alert('暂无待购商品')
        }


    } else {
        console.log('iframe not found');
    }
} catch (error) {

}
