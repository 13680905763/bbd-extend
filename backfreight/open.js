

try {
    console.log(6666);

    const iframes = document.querySelectorAll('iframe');
    const iframe = iframes[iframes.length - 1];




    // console.log(iframe);
    if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        // 获取iframe中的元素
        // console.log(iframeDocument);
        const forminputele = Array.from(iframeDocument.querySelectorAll('.form-group'))[0].querySelectorAll('input')[1]
        const formbtnele = iframeDocument.querySelector('.btn-success')
        console.log('forminputele', forminputele);
        console.log('formbtnele', formbtnele);


        let bIndex
        let pIndex
        const titles = Array.from(iframeDocument.querySelectorAll('th[data-field]'))
        titles.forEach((title, index) => {
            if (title.textContent == '包裹编号') {
                bIndex = index
            }
            if (title.textContent == '运费支出') {
                pIndex = index
            }

        })
        console.log(bIndex, pIndex);

        //过滤掉后剩1688且有订单号和物流单号为空的 商品行
        const f = Array.from(iframeDocument.querySelectorAll('tr[data-index]')).filter(tr => {
            const item = tr.querySelectorAll('td')[pIndex].querySelectorAll('a')[0].textContent == '0.00'

            return item
        })


        console.log('f', f)

        chrome.storage.local.get('orderShippingMap', (data) => {
            if (chrome.runtime.lastError) {
                console.error('获取失败:', chrome.runtime.lastError);
            } else {
                console.log("订单-运费映射已保存:", data.orderShippingMap);
                if (data.orderShippingMap) {


                    let message = "请核对订单与运费信息：\n\n";

                    for (const [order, fee] of Object.entries(data.orderShippingMap)) {
                        message += `${order} → ¥${fee}\n`;
                    }
                    if (confirm(message)) {
                        for (const [order, fee] of Object.entries(data.orderShippingMap)) {
                            message += `${order} → ¥${fee}\n`;
                            const params = new URLSearchParams({
                                order,
                                fee
                            });
                            window.open(`https://bbdbuy.com/admins6e5zkx.php/sendorder/lists?${params.toString()}`, '_blank');
                        }
                        Object.keys(data.orderShippingMap).forEach(order => {
                            forminputele.value = order
                            formbtnele.click()
                            // const iframes = document.querySelectorAll('iframe');
                            // const iframe = iframes[iframes.length - 1];
                            // const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                            // const a = iframeDocument.querySelector('a[data-name="buyfreight"]')
                            // console.log(a);
                            // a.click()
                            // const input = iframeDocument.querySelector('.form-control')
                            // input.value = data.orderShippingMap[order]
                            // console.log(order, '已处理');

                        })
                        // console.log('data', data.orderShippingMap);
                        // Array.from(iframeDocument.querySelectorAll('.bs-checkbox')).forEach(item => {
                        //     item.querySelector('input').checked = false
                        // })
                        // f.forEach((tr, index) => {
                        //     const o = tr.querySelectorAll('td')[bIndex].textContent
                        //     const i = tr.querySelectorAll('td')[pIndex].querySelector('a')
                        //     if (data.orderShippingMap[o]) {

                        //         i.click()
                        //         console.log(6666, tr.querySelectorAll('td')[pIndex]);
                        //         tr.querySelectorAll('td')[pIndex].querySelector('input').value = data.orderShippingMap[o]
                        //         tr.querySelectorAll('td')[pIndex].querySelector('button[type=submit]').click()
                        //         tr.querySelector('td').click()

                        //     }
                        // })
                        // chrome.storage.local.clear(() => {
                        //     console.log("local 存储已清空");
                        // });
                    } else {
                        console.log("取消保存");

                    }
                } else {
                    alert('请先录入订单信息')
                }

            }
        });
    } else {
        console.log('iframe not found');
    }
} catch (error) {

}
