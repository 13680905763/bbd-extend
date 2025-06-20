
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
        //过滤掉后剩1688且有订单号和物流单号为空的 商品行
        const goods = Array.from(iframeDocument.querySelectorAll('tr[data-index]')).filter(tr => {
            const item = tr.querySelectorAll('td')[inputIndex].querySelectorAll('input')[3].value
            const hasOrderValue = tr.querySelectorAll('td')[inputIndex].querySelectorAll('input')[0].value
            const hasSku = tr.querySelectorAll('td')[goodsIndex]
                .querySelectorAll('small')[1]
            return hasOrderValue && !item && hasSku
        }
        )
        console.log('goods', goods);


        chrome.storage.local.get(null, (data) => {
            if (chrome.runtime.lastError) {
                console.error('获取失败:', chrome.runtime.lastError);
            } else {
                Object.keys(data).forEach(key => {
                    // console.log(key, data[key]);
                    if (data[key] == 'init' || !data[key]) {
                        chrome.storage.local.remove(key, () => {
                            if (chrome.runtime.lastError) {
                                console.error('删除失败:', chrome.runtime.lastError);
                            } else {
                                console.log('键 keyToDelete 已删除');
                            }
                        });
                    }
                });
                chrome.storage.local.get(null, (data) => {
                    if (confirm(`已获取${Object.keys(data).length}个商品物流信息信息，确定已打开弹窗`)) {
                        const filtergood = goods.filter((good, index) => {
                            const openbtn = good.querySelectorAll('td')[inputIndex].querySelectorAll('a')[1] ?? good.querySelectorAll('td')[inputIndex].querySelectorAll('a')[0]
                            const link = good.querySelectorAll('td')[goodsIndex].querySelectorAll('a')[0].href
                            const type = link.includes('weidian') ? 'wd' : link.includes('taobao') ? 'tb' : '1688'
                            const goodname = getOwnTextOnly(good.querySelectorAll('td')[goodsIndex].querySelector('.goodsname'))
                            const sku = cleanText(good.querySelectorAll('td')[goodsIndex]
                                .querySelectorAll('small')[1].innerHTML.split('<br>')
                                .map(item => item.split(':')[1])
                                .filter(item => item).join(''))
                            const order = good.querySelectorAll('td')[inputIndex].querySelector('input').value
                            console.log(goodname, order, sku);

                            if (goodname && order && sku) {
                                const key = `${order}_${goodname}_${sku}_${type}`
                                if (data.hasOwnProperty(key)) {
                                    return true
                                    // console.log('快递号', data[key]);
                                    // openbtn.click()
                                    // console.log('openbtn', openbtn);
                                    // const models = Array.from(iframeDocument.querySelectorAll('.layui-layer-iframe'))[index]
                                    // console.log('models', models);
                                    // console.log(key, data, data[key]);
                                    // models.dataset.fastMail = data[key]
                                }
                            }
                        })


                        filtergood.forEach((good, index) => {
                            const openbtn = good.querySelectorAll('td')[inputIndex].querySelectorAll('a')[1] ?? good.querySelectorAll('td')[inputIndex].querySelectorAll('a')[0]
                            const link = good.querySelectorAll('td')[goodsIndex].querySelectorAll('a')[0].href
                            const type = link.includes('weidian') ? 'wd' : link.includes('taobao') ? 'tb' : '1688'
                            const goodname = getOwnTextOnly(good.querySelectorAll('td')[goodsIndex].querySelector('.goodsname'))
                            const sku = cleanText(good.querySelectorAll('td')[goodsIndex]
                                .querySelectorAll('small')[1].innerHTML.split('<br>')
                                .map(item => item.split(':')[1])
                                .filter(item => item).join(''))
                            const order = good.querySelectorAll('td')[inputIndex].querySelector('input').value
                            console.log(goodname, order, sku);
                            if (goodname && order && sku) {
                                const key = `${order}_${goodname}_${sku}_${type}`
                                if (data.hasOwnProperty(key)) {
                                    console.log('快递号', data[key]);
                                    openbtn.click()
                                    console.log('openbtn', openbtn);
                                    const models = Array.from(iframeDocument.querySelectorAll('.layui-layer-iframe'))[index]
                                    console.log('models', models);
                                    console.log(key, data, data[key]);
                                    models.dataset.fastMail = data[key]
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
    } else {
        console.log('iframe not found');
    }
} catch (error) {
    console.log(error);

}
