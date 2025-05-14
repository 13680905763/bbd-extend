
try {

    function getOwnTextOnly(element) {
        let text = ''
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent
            }
        }
        return text.trim().replace(/[()-/:【】]/g, '').replace(/[\s\t\n：]/g, '')
    }

    const iframes = document.querySelectorAll('iframe');
    const iframe = iframes[iframes.length - 1];

    if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        // 获取iframe中的元素
        // console.log(iframeDocument);
        chrome.storage.local.clear(() => {
            if (chrome.runtime.lastError) {
                console.error('清空失败:', chrome.runtime.lastError);
            } else {
                console.log('所有本地存储数据已清空');
            }
        });
        // // 筛选商家
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
            if (title.textContent == '商品编号') {
                goodOrderIndex = index
            }
        })


        //过滤掉后剩1688且有订单号和物流单号为空的 商品行
        const goods1 = Array.from(iframeDocument.querySelectorAll('tr[data-index]')).filter(tr => {
            const item = tr.querySelectorAll('td')[goodsIndex].querySelectorAll('a')[0].href.includes('taobao')
            console.log(item);

            return item
        }
        )
        console.log('goods1', goods1);

        const goods = goods1.filter((tr) => {
            const item = tr.querySelectorAll('td')[inputIndex].querySelectorAll('input')[3].value
            const hasOrderValue = tr.querySelectorAll('td')[inputIndex].querySelectorAll('input')[0].value
            const hasSku = tr.querySelectorAll('td')[goodsIndex]
                .querySelectorAll('small')[1]

            console.log(item, hasOrderValue, hasSku);

            if (hasOrderValue && !item && hasSku) {
                console.log(tr);
                return true
            }
        }
        )

        //input盒子 
        const inputBox = goods.map(item => {
            return item.querySelectorAll('td')[inputIndex]
        })



        console.log('goods', goods);

        let keyArr = []
        console.log('keyArr', keyArr);

        goods.forEach((good, index) => {
            const goodname = getOwnTextOnly(good.querySelectorAll('td')[goodsIndex].querySelector('.goodsname'))

            try {
                const sku = good.querySelectorAll('td')[goodsIndex]
                    .querySelectorAll('small')[1]
                    .innerHTML
                    .split('<br>')
                    .map(item => item.split(':')[1])
                    .filter(item => item).join(';')

                console.log(sku);
                const order = inputBox[index].querySelector('input').value

                if (sku && order) {
                    const key = `${order}_${goodname}_${sku}`
                    keyArr.push(key)
                }
            } catch (error) {
                console.log(error);

            }

        })
        console.log('keyArr11', keyArr);

        keyArr.forEach(key => {
            chrome.storage.local.set({ [key]: 'init' }, () => {
                console.log(`${key} 设置成功`);
            });
        })

        if (confirm(`已获取${keyArr.length}个商品信息，是否进入taobao页面获取快递单号`)) {

            keyArr.forEach(key => {
                // window.open(`https://weidian.com/user/order-new/searchList?key=${key}`, '_blank');
                // window.open(`https://weidian.com/user/order-new/searchList?key=${key}`, '_blank');
                // window.open(`https://weidian.com/user/order-new/logistics.php?oid=${key.split('_')[0]}&goodname=${key.split('_')[1]}&sku=${key.split('_')[2]}`, '_blank');
                window.open(`https://distributor.taobao.global/apps/order/list?order=${key.split('_')[0]}&goodname=${key.split('_')[1]}&sku=${key.split('_')[2]}`, '_blank');
            })
            console.log('用户点击了“确定”');
        } else {
            console.log('用户点击了“取消”');
        }








    } else {
        console.log('iframe not found');
    }
} catch (error) {

}
