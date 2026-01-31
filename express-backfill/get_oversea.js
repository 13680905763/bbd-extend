
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
        // 获取iframe中的元素，整个订单表是放在iframe中的
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        // 获取 海外淘宝采购 跟踪号/快递公司 列的index
        let overseasIndex
        let inputIndex
        iframeDocument.querySelectorAll('th[data-field]').forEach((title, index) => {
            const text = title.textContent.trim()
            if (text === '跟踪号/快递公司') {
                inputIndex = index
            } else if (text === '海外淘宝采购') {
                overseasIndex = index
            }
        })
        console.log('跟踪号/快递公司 Index', inputIndex);
        console.log('海外淘宝采购', overseasIndex);

        //筛选出 有采购编号 没有快递单号 有sku 的商品行
        const goods = Array.from(iframeDocument.querySelectorAll('tr[data-index]')).filter(tr => {
            const cells = tr.cells
            const inputCell = cells[inputIndex]
            const overseasCell = cells[overseasIndex]

            if (!inputCell || !overseasCell) return false

            const inputs = inputCell.querySelectorAll('input')
            const hasOrderValue = inputs[0]?.value
            // console.log('hasOrderValue', hasOrderValue, !hasOrderValue);

            //  有采购编号 海外淘宝采购为否
            if (hasOrderValue || overseasCell.textContent == '否') return false

            return true
        })
        console.log('无采购编号 有海外淘宝采购 的商品行', goods);

        const otherModels = Array.from(iframeDocument.querySelectorAll('.layui-layer-iframe'))
        if (otherModels.length) {
            confirm(`检测到${otherModels.length}个其他操作窗口, 请先关闭, 再操作`)
        } else {
            // 初始化快递单号map
            goods.forEach((good, index) => {
                const cells = good.cells
                const overseas = cells[overseasIndex].textContent
                const inputCell = cells[inputIndex]
                const openbtn = inputCell.querySelectorAll('a')[1] ?? inputCell.querySelectorAll('a')[0]
                openbtn.click()
                const models = Array.from(iframeDocument.querySelectorAll('.layui-layer-iframe'))
                const model = models[index]
                console.log('model', model);
                if (model) {
                    model.dataset.overseas = overseas
                }
            })
        }

        // chrome.storage.local.get(null, function (data) {
        //     const keyArr = Object.keys(data)
        //     console.log('keyArr', keyArr);
        //     if (confirm(`共获取${keyArr.length}个可查商品信息，是否进入查找页面获取快递单号`)) {
        //         const PLATFORMS = {
        //             '1688': {
        //                 url: 'https://trade.1688.com/order/buyer_order_print.htm',
        //                 idKey: 'order_id'
        //             },
        //             'tb': {
        //                 url: 'https://distributor.taobao.global/apps/order/list',
        //                 idKey: 'order'
        //             },
        //             'wd': {
        //                 url: 'https://weidian.com/user/order-new/logistics.php',
        //                 idKey: 'oid'
        //             }
        //         };

        //         keyArr.forEach(key => {
        //             const [orderId, goodname, sku, type] = key.split('_');
        //             const config = PLATFORMS[type];

        //             if (config) {
        //                 const params = new URLSearchParams({
        //                     [config.idKey]: orderId,
        //                     goodname,
        //                     sku,
        //                     type
        //                 });
        //                 window.open(`${config.url}?${params.toString()}`, '_blank');
        //             }
        //         })
        //         console.log('用户点击了“确定”');
        //     } else {
        //         console.log('用户点击了“取消”');
        //     }
        // })
    } else {
        console.log('iframe not found');
    }
} catch (error) {

}
