
try {
    const iframes = document.querySelectorAll('iframe');
    const iframe = iframes[iframes.length - 1];
    // console.log(iframe);
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
        return text.trim().replace(/[()-/:【】]/g, '').replace(/[\s\t\n：]/g, '')
    }
    if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        // 获取iframe中的元素
        // console.log(iframeDocument);

        // 筛选title
        let inputIndex
        let goodsIndex
        const titles = iframeDocument.querySelectorAll('th[data-field]')
        titles.forEach((title, index) => {
            const text = title.textContent.trim()
            if (text === '跟踪号/快递公司') {
                inputIndex = index
            } else if (text === '商品名称') {
                goodsIndex = index
            }
        })

        //
        const goods = Array.from(iframeDocument.querySelectorAll('tr[data-index]')).filter(tr => {
            const cells = tr.cells
            const inputCell = cells[inputIndex]
            const goodsCell = cells[goodsIndex]

            if (!inputCell || !goodsCell) return false

            const inputs = inputCell.querySelectorAll('input')
            const hasOrderValue = inputs[0]?.value
            const hasTrackingNo = inputs[3]?.value

            if (!hasOrderValue || hasTrackingNo) return false

            const hasSku = goodsCell.querySelectorAll('small').length
            return !!hasSku
        })
        console.log('goods', goods);
        const otherModels = Array.from(iframeDocument.querySelectorAll('.layui-layer-iframe'))
        if (otherModels.length) {
            confirm(`检测到${otherModels.length}个其他操作窗口, 请先关闭, 再操作`)
        } else {
            chrome.storage.local.get(null, (data) => {
                if (chrome.runtime.lastError) {
                    console.error('获取失败:', chrome.runtime.lastError);
                } else {
                    let initCount = 0
                    // 清理无效数据
                    Object.keys(data).forEach(key => {
                        if (data[key] == 'init' || !data[key]) {
                            console.log('删除无效数据', key);
                            initCount++
                            chrome.storage.local.remove(key);
                        }
                    });

                    chrome.storage.local.get(null, (data) => {
                        const validKeys = Object.keys(data)
                        if (validKeys.length === 0) {
                            confirm(`${initCount}个无效信息（无快递单号）`)
                            console.log('没有获取到有效的物流信息');
                            return;
                        }

                        if (confirm(`已获取${validKeys.length}个商品物流信息信息，${initCount}个无效信息（无快递单号），确定已打开弹窗`)) {
                            const filtergood = goods.filter((good) => {
                                const cells = good.cells
                                const goodsCell = cells[goodsIndex]
                                const inputCell = cells[inputIndex]

                                const link = goodsCell.querySelector('a')?.href || ''
                                const type = link.includes('weidian') ? 'wd' : link.includes('taobao') ? 'tb' : '1688'

                                let goodname = getOwnTextOnly(goodsCell.querySelector('.goodsname'))
                                if (!goodname) {
                                    const linkText = goodsCell.querySelector('.goodsname a')?.textContent || ''
                                    goodname = cleanText(linkText)
                                }

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

                                const order = inputCell.querySelector('input').value
                                // console.log(goodname, order, sku);

                                if (goodname && order && sku) {
                                    const key = `${order}_${goodname}_${sku}_${type}`
                                    return data.hasOwnProperty(key)
                                }
                                return false
                            })


                            filtergood.forEach((good, index) => {
                                const cells = good.cells
                                const goodsCell = cells[goodsIndex]
                                const inputCell = cells[inputIndex]
                                const openbtn = inputCell.querySelectorAll('a')[1] ?? inputCell.querySelectorAll('a')[0]
                                const link = goodsCell.querySelector('a')?.href || ''
                                const type = link.includes('weidian') ? 'wd' : link.includes('taobao') ? 'tb' : '1688'

                                let goodname = getOwnTextOnly(goodsCell.querySelector('.goodsname'))
                                if (!goodname) {
                                    const linkText = goodsCell.querySelector('.goodsname a')?.textContent || ''
                                    goodname = cleanText(linkText)
                                }

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

                                const order = inputCell.querySelector('input').value
                                console.log(goodname, order, sku);

                                if (goodname && order && sku) {
                                    const key = `${order}_${goodname}_${sku}_${type}`
                                    if (data.hasOwnProperty(key)) {
                                        console.log('快递号', data[key]);
                                        if (openbtn) openbtn.click()
                                        // console.log('openbtn', openbtn);

                                        // 注意：这里使用的是iframeDocument，可能需要根据实际弹窗生成位置调整
                                        const models = Array.from(iframeDocument.querySelectorAll('.layui-layer-iframe'))
                                        // 由于 filtergood 是过滤后的数组，index 对应的是 filtergood 的索引
                                        // 但 models 是页面上所有的弹窗，这里逻辑可能存在风险，需确保弹窗也是按顺序生成的
                                        // 原始代码是用 index 匹配，这里保持一致
                                        const model = models[index]

                                        if (model) {
                                            console.log('models', model);
                                            console.log(key, data, data[key]);
                                            model.dataset.fastMail = data[key]
                                        }
                                    }
                                }
                            })
                            console.log('用户点击了“确定”');
                        } else {
                            console.log('用户点击了“取消”');
                        }
                    })
                }
            });
        }

    } else {
        console.log('iframe not found');
    }
} catch (error) {
    console.log(error);

}
