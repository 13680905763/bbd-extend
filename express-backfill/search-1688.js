
try {
    const params = new URLSearchParams(window.location.search)
    const order = params.get('order_id')
    const goodname = params.get('goodname')
    const sku = params.get('sku')
    const type = params.get('type')
    const key = `${order}_${goodname}_${sku}_${type}`
    console.log('key', key);
    console.log(666, document.querySelector('body'));


    const intervalInit = setInterval(() => {
        if (document.querySelector('.sub-tit')) {
            clearInterval(intervalInit)
            console.log('获取到页面数据');

            const pageorder = document.querySelector('.cell-order-info li').textContent.trim().split('：')[1]
            const fastMailArr = Array.from(document.querySelectorAll('.cell-logistics-info')).map(item => {
                return item.querySelectorAll('li')[2].querySelector('span').textContent.trim()
            })
            const skutable = Array.from(document.querySelectorAll('.cell-bor-2')).map(item => {
                return item.querySelector('tbody')
            })
            console.log(pageorder, fastMailArr, skutable);
            fastMailArr.forEach((item, index) => {
                skutable[index].querySelectorAll('tr').forEach(tr => {
                    // console.log(tr);
                    const pagegoodname = tr.querySelectorAll('td')[2].textContent.trim()
                    const pagesku = tr.querySelectorAll('td')[3].textContent.replace(/[\s\t\n]/g, '');
                    console.log(pagegoodname);
                    console.log(pagesku);
                    const isorder = pageorder == order
                    const isgoodname = goodname.split('').filter(item => {
                        return pagegoodname.includes(item)
                    }).length == goodname.split('').length
                    console.log('isgoodname', goodname.split('').filter(item => {
                        return pagegoodname.includes(item)
                    }).length, goodname.split('').length);

                    const issku = sku.split('').filter(item => {
                        return pagesku.includes(item)
                    }).length == sku.split('').length
                    console.log('isorder', isorder, 'isgoodname', isgoodname, 'issku', issku);

                    if (isorder && isgoodname && issku) {
                        console.log('抓取到快递单号', item);
                        chrome.storage.local.set({ [key]: item })
                    } else {
                        console.log('未找到订单号~~~~~~');
                    }
                })
            })
        }
    }, 1000);


} catch (error) {
    console.log(error);

}
