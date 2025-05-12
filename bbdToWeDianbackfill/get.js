
try {



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
        let goodOrderIndex
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
        const goods = Array.from(iframeDocument.querySelectorAll('tr[data-index]')).filter(tr => {
            const item = tr.querySelectorAll('td')[goodsIndex].querySelectorAll('a')[0].href.includes('weidian')
            return item
        }
        ).filter((tr) => {
            const item = tr.querySelectorAll('td')[inputIndex].querySelectorAll('input')[3].value
            const hasOrderValue = tr.querySelectorAll('td')[inputIndex].querySelectorAll('input')[0].value
            const hasSku = tr.querySelectorAll('td')[goodsIndex]
                .querySelectorAll('small')[1]
            return hasOrderValue && !item && hasSku
        }
        )

        //input盒子 
        const inputBox = goods.map(item => {
            return item.querySelectorAll('td')[inputIndex]
        })

        // 显示隐藏的查快递element
        inputBox.forEach((item) => {
            // 1. 获取目标容器的位置
            const hoverTrigger = item.querySelector('input')
            // 2. 创建并触发鼠标进入事件
            const mouseEnterEvent = new MouseEvent('mouseover', {
                bubbles: true,    // 允许事件冒泡
                cancelable: true,
                view: window
            });
            hoverTrigger.dispatchEvent(mouseEnterEvent);
        })

        console.log('goods', goods);

        let keyArr = []
        console.log('keyArr', keyArr);

        goods.forEach((good, index) => {
            const sku = good.querySelectorAll('td')[goodsIndex]
                .querySelectorAll('small')[1]
                .textContent.replace(/[\s\t\n：]/g, '')
                .replace(/[:：]/g, '')
            const order = inputBox[index].querySelector('input').value

            if (sku && order) {
                const key = `${order}_${sku}`
                keyArr.push(key)
            }
            console.log(666);
        })
        console.log('keyArr11', keyArr);

        keyArr.forEach(key => {
            chrome.storage.local.set({ [key]: 'init' }, () => {
                console.log(`${key} 设置成功`);
            });
        })

        if (confirm(`已获取${keyArr.length}个商品信息，是否进入微店页面获取快递单号`)) {

            keyArr.forEach(key => {
                // window.open(`https://weidian.com/user/order-new/searchList?key=${key}`, '_blank');
                window.open(`https://weidian.com/user/order-new/searchList?key=${key}`, '_blank');
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
