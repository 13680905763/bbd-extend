
try {
    const params = new URLSearchParams(window.location.search)
    const targetOrder = params.get('order_id')
    const targetGoodName = params.get('goodname')
    const targetSku = params.get('sku')
    const type = params.get('type')
    const key = `${targetOrder}_${targetGoodName}_${targetSku}_${type}`
    console.log('Target Key:', key);

    // 模糊匹配：检查 source 中的每个字符是否都存在于 target 中
    const isFuzzyMatch = (source, target) => {
        if (!source || !target) return false
        return source.split('').every(char => target.includes(char))
    }

    const intervalInit = setInterval(() => {
        if (document.querySelector('.sub-tit')) {
            clearInterval(intervalInit)
            console.log('获取到页面数据');

            // 获取页面订单号，兼容中英文冒号
            const orderInfo = document.querySelector('.cell-order-info li')?.textContent || ''
            const pageOrder = orderInfo.split(/[:：]/)[1]?.trim()

            const logisticsItems = document.querySelectorAll('.cell-logistics-info')
            const skuTables = document.querySelectorAll('.cell-bor-2')

            console.log('PageOrder:', pageOrder);

            // 遍历物流信息块
            logisticsItems.forEach((item, index) => {
                // 获取快递单号
                const trackingNo = item.querySelectorAll('li')[2]?.querySelector('span')?.textContent.trim()
                // 获取对应的商品表格
                const tbody = skuTables[index]?.querySelector('tbody')
                if(!trackingNo) console.log('没有快递单号', index); 
                if (!trackingNo || !tbody) return

                const rows = tbody.rows // 使用 rows 集合
                Array.from(rows).forEach(tr => {
                    const cells = tr.cells
                    if (cells.length < 4) return

                    const pageGoodName = cells[2].textContent.trim()
                    // 去除所有空白字符
                    const pageSku = cells[3].textContent.replace(/[\s\t\n]/g, '')

                    const isOrderMatch = pageOrder == targetOrder
                    const isNameMatch = isFuzzyMatch(targetGoodName, pageGoodName)
                    const isSkuMatch = isFuzzyMatch(targetSku, pageSku)

                    console.log('Check:', { pageGoodName,targetGoodName, pageSku,targetSku, isOrderMatch, isNameMatch, isSkuMatch })

                    if (isOrderMatch && isNameMatch && isSkuMatch) {
                        console.log('抓取到快递单号', trackingNo);
                        chrome.storage.local.set({ [key]: trackingNo })
                    }
                })
            })
        }
    }, 1000);

} catch (error) {
    console.error('Search Script Error:', error);
}
