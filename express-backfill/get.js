
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
        // 获取 商品信息 跟踪号/快递公司 列的index
        let inputIndex 
        let goodsIndex
        iframeDocument.querySelectorAll('th[data-field]').forEach((title, index) => {
            const text = title.textContent.trim()
            if (text === '跟踪号/快递公司') {
                inputIndex = index
            } else if (text === '商品名称') {
                goodsIndex = index
            }
        })
        console.log('跟踪号/快递公司 Index', inputIndex);
        console.log('商品名称 goodsIndex', goodsIndex);

        //筛选出 有采购编号 没有快递单号 有sku 的商品行
        const goods = Array.from(iframeDocument.querySelectorAll('tr[data-index]')).filter(tr => {
            const cells = tr.cells
            const inputCell = cells[inputIndex]
            const goodsCell = cells[goodsIndex]

            if (!inputCell || !goodsCell) return false

            const inputs = inputCell.querySelectorAll('input')
            const hasOrderValue = inputs[0]?.value
            const hasTrackingNo = inputs[3]?.value
            //  有采购编号 没有快递单号
            if (!hasOrderValue || hasTrackingNo) return false

            // small0是红色的sku，1是正常的sku
            const hasSku = goodsCell.querySelectorAll('small').length
            return !!hasSku
        })
        console.log('有采购编号 没有快递单号 有sku 的商品行', goods);

        // 初始化快递单号map
        goods.forEach((good) => {
            const cells = good.cells
            const goodsCell = cells[goodsIndex]
            const inputCell = cells[inputIndex]

            const link = goodsCell.querySelector('a')?.href || ''
            const type = link.includes('weidian') ? 'wd' : link.includes('taobao') ? 'tb' : '1688'
            // console.log('商品类型', type);

            let goodname = getOwnTextOnly(goodsCell.querySelector('.goodsname'))
            if (!goodname) {
                const linkText = goodsCell.querySelector('.goodsname a')?.textContent || ''
                goodname = cleanText(linkText)
            }
            // console.log('商品名称', goodname);

            const smalls = goodsCell.querySelectorAll('small')
            const skuEl = smalls[1] || smalls[0]
            const skuHtml = skuEl?.innerHTML || ''
            
            const skuText = skuHtml.split('<br>')
                .map(item => {
                    const parts = item.split(/[:：]/)
                    return parts.length > 1 ? parts[1] : parts[0]
                })
                .filter(item => item)
                .join('')
                
            const sku = cleanText(skuText)
            // console.log('sku', sku);

            const order = inputCell.querySelector('input').value
            // console.log('采购编号', order);

            if (goodname && order && sku) {
                const key = `${order}_${goodname}_${sku}_${type}`
                chrome.storage.local.set({ [key]: 'init' });
            }
        })

        chrome.storage.local.get(null, function (data) {
            const keyArr = Object.keys(data)
            console.log('keyArr', keyArr);
            if (confirm(`共获取${keyArr.length}个可查商品信息，是否进入查找页面获取快递单号`)) {
                const PLATFORMS = {
                    '1688': {
                        url: 'https://trade.1688.com/order/buyer_order_print.htm',
                        idKey: 'order_id'
                    },
                    'tb': {
                        url: 'https://distributor.taobao.global/apps/order/list',
                        idKey: 'order'
                    },
                    'wd': {
                        url: 'https://weidian.com/user/order-new/logistics.php',
                        idKey: 'oid'
                    }
                };

                keyArr.forEach(key => {
                    const [orderId, goodname, sku, type] = key.split('_');
                    const config = PLATFORMS[type];

                    if (config) {
                        const params = new URLSearchParams({
                            [config.idKey]: orderId,
                            goodname,
                            sku,
                            type
                        });
                        window.open(`${config.url}?${params.toString()}`, '_blank');
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
