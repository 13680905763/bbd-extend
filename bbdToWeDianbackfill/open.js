
try {
    const iframes = document.querySelectorAll('iframe');
    const iframe = iframes[iframes.length - 1];
    // console.log(iframe);

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

        console.log('goods', goods);

        //input盒子 
        const inputBox = goods.map(item => {
            return item.querySelectorAll('td')[inputIndex]
        })


        chrome.storage.local.get(null, (data) => {
            if (chrome.runtime.lastError) {
                console.error('获取失败:', chrome.runtime.lastError);
            } else {
                Object.keys(data).forEach(key => {
                    console.log(key, data[key]);
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
                        const filterGoods = goods.filter((good, index) => {
                            const goodname = getOwnTextOnly(good.querySelectorAll('td')[goodsIndex].querySelector('.goodsname'))

                            const sku = good.querySelectorAll('td')[goodsIndex]
                                .querySelectorAll('small')[1].innerHTML.split('<br>')
                                .map(item => item.split(':')[1])
                                .filter(item => item).join(';')
                            const order = inputBox[index].querySelector('input').value
                            if (sku && order) {
                                const key = `${order}_${goodname}_${sku}`


                                if (data.hasOwnProperty(key)) {
                                    console.log('快递号', data[key]);
                                    return true
                                } else {
                                    return false
                                }
                            } else {
                                return false
                            }
                        })
                        console.log('filterGoods', filterGoods);




                        //input盒子 
                        const filterInputBox = filterGoods.map(item => {
                            return item.querySelectorAll('td')[inputIndex]
                        })

                        console.log('filterInputBox', filterInputBox);

                        filterGoods.forEach((good, index) => {
                            try {
                                const goodname = getOwnTextOnly(good.querySelectorAll('td')[goodsIndex].querySelector('.goodsname'))

                                const sku = good.querySelectorAll('td')[goodsIndex]
                                    .querySelectorAll('small')[1].innerHTML.split('<br>')
                                    .map(item => item.split(':')[1])
                                    .filter(item => item).join(';')
                                const order = filterInputBox[index].querySelector('input').value
                                const key = `${order}_${goodname}_${sku}`
                                const openbtn = filterInputBox[index].querySelectorAll('a')[1] ?? filterInputBox[index].querySelectorAll('a')[0]
                                openbtn.click()
                                console.log('openbtn', openbtn);

                                const models = Array.from(iframeDocument.querySelectorAll('.layui-layer-iframe'))[index]
                                console.log('models', models);
                                console.log(key, data, data[key]);

                                models.dataset.fastMail = data[key]
                            } catch (error) {
                                console.log(error);

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

}
