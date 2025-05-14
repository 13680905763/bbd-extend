
try {
    const iframes = document.querySelectorAll('iframe');
    const iframe = iframes[iframes.length - 1];
    // console.log(iframe);
    if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        // 获取iframe中的元素
        // console.log(iframeDocument);
        let inputIndex
        let goodsIndex
        const titles = Array.from(iframeDocument.querySelectorAll('th[data-field]'))
        titles.forEach((title, index) => {
            if (title.textContent == '跟踪号/快递公司') {
                inputIndex = index
            }
            if (title.textContent == '商品名称') {
                goodsIndex = index
            }

        })


        Array.from(iframeDocument.querySelectorAll('.bs-checkbox')).forEach(item => {
            item.querySelector('input').checked = false
        })

        //过滤掉后剩1688且有订单号和物流单号为空的 商品行
        const goods = Array.from(iframeDocument.querySelectorAll('tr[data-index]')).filter(tr => {
            const item = tr.querySelectorAll('td')[inputIndex].querySelectorAll('input')[3].value
            const hasOrderValue = tr.querySelectorAll('td')[inputIndex].querySelectorAll('input')[0].value
            const hasSku = tr.querySelectorAll('td')[goodsIndex]
                .querySelectorAll('small')[1]
            return hasOrderValue && item && hasSku
        }
        )
        console.log('goods', goods);

        try {
            chrome.storage.local.get(null, (data) => {
                if (chrome.runtime.lastError) {
                    console.error('获取失败:', chrome.runtime.lastError);
                } else {
                    const searchValueArr = Object.values(data);
                    goods.forEach((tr, index) => {
                        console.log(tr);

                        const fastMailValue = tr.querySelectorAll('td')[inputIndex].querySelectorAll('input')[3].value
                        console.log('fastMailValue', fastMailValue);
                        console.log('searchValueArr', searchValueArr);

                        if (fastMailValue && searchValueArr.includes(fastMailValue)) {
                            console.log('fastMailValue', fastMailValue);
                            console.log('tr.querySelector(td)', tr.querySelector('td'));
                            tr.querySelector('td').click()
                        }
                    })
                }
            });
        } catch (error) {
            console.log(error);

        }


    } else {
        console.log('iframe not found');
    }
} catch (error) {

}
