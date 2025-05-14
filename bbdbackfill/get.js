
try {
    function cleanText(text) {
        return text
            .trim()
            .replace(/[()\-\/:：【】#’]/g, '')   // 去掉中英文符号
            .replace(/[\s\t\n]/g, '');      // 去掉空格、制表符、换行、全角冒号
    }
    function getOwnTextOnly(element) {
        let text = ''
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent
            }
        }
        return cleanText(text)
    }
    chrome.storage.local.clear(() => {
        if (chrome.runtime.lastError) {
            console.error('清空失败:', chrome.runtime.lastError);
        } else {
            console.log('所有本地缓存数据已清空');
        }
    });
    const iframes = document.querySelectorAll('iframe');
    const iframe = iframes[iframes.length - 1];
    if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        // 获取iframe中的元素
        // console.log(iframeDocument);
        // 筛选title
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
        //过滤掉 没有订单号 有快递单号 商品sku正常 的商品行
        const goods = Array.from(iframeDocument.querySelectorAll('tr[data-index]')).filter(tr => {
            // const item = tr.querySelectorAll('td')[goodsIndex].querySelectorAll('a')[0].href.includes('weidian')
            const item = tr.querySelectorAll('td')[inputIndex].querySelectorAll('input')[3].value
            const hasOrderValue = tr.querySelectorAll('td')[inputIndex].querySelectorAll('input')[0].value
            const hasSku = tr.querySelectorAll('td')[goodsIndex]
                .querySelectorAll('small')[1]
            return hasOrderValue && !item && hasSku
        }
        )
        console.log('goods', goods);

        // 初始化快递单号map
        goods.forEach((good, index) => {
            const link = good.querySelectorAll('td')[goodsIndex].querySelectorAll('a')[0].href
            const type = link.includes('weidian') ? 'wd' : link.includes('taobao') ? 'tb' : '1688'
            console.log('type', type);

            const goodname = getOwnTextOnly(good.querySelectorAll('td')[goodsIndex].querySelector('.goodsname'))
            // console.log('goodname', goodname);
            const sku = cleanText(good.querySelectorAll('td')[goodsIndex]
                .querySelectorAll('small')[1].innerHTML.split('<br>')
                .map(item => item.split(':')[1])
                .filter(item => item).join(''))
            // console.log('sku', sku);
            const order = good.querySelectorAll('td')[inputIndex].querySelector('input').value
            // console.log('order', order);

            if (goodname && order && sku) {
                const key = `${order}_${goodname}_${sku}_${type}`
                chrome.storage.local.set({ [key]: 'init' });
            }
        })

        chrome.storage.local.get(null, function (data) {
            const keyArr = Object.keys(data)
            console.log('keyArr', keyArr);
            if (confirm(`共获取${keyArr.length}个可查商品信息，是否进入查找页面获取快递单号`)) {
                keyArr.forEach(key => {
                    const type = key.split('_')[3]
                    if (type == '1688') {
                        window.open(`https://trade.1688.com/order/buyer_order_print.htm?order_id=${key.split('_')[0]}&goodname=${key.split('_')[1]}&sku=${key.split('_')[2]}&type=${type}`, '_blank');
                    } else if (type == 'tb') {
                        window.open(`https://distributor.taobao.global/apps/order/list?order=${key.split('_')[0]}&goodname=${key.split('_')[1]}&sku=${key.split('_')[2]}&type=${type}`, '_blank');
                    } else if (type == 'wd') {
                        window.open(`https://weidian.com/user/order-new/logistics.php?oid=${key.split('_')[0]}&goodname=${key.split('_')[1]}&sku=${key.split('_')[2]}&type=${type}`, '_blank');
                    }
                })
                console.log('用户点击了“确定”');
            } else {
                console.log('用户点击了“取消”');
            }
        })
    } else {
        console.log('iframe not found');
    }
} catch (error) {

}
