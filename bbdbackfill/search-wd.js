try {
    const params = new URLSearchParams(window.location.search)
    const order = params.get('oid')
    const goodname = params.get('goodname')
    const sku = params.get('sku')
    const type = params.get('type')
    const key = `${order}_${goodname}_${sku}_${type}`
    console.log('key', key);

    const tabs = Array.from(document.querySelectorAll('.package'))
    const content = document.querySelector('.deliver_info')

    if (tabs.length) {
        console.log('多包裹');
        // for (let i = 0; i < tabs.length; i++) {
        //     if (!isHas) {
        //         const btnmore = document.querySelectorAll('.logistics_item_seller_see_more')[1]?.querySelector('p')
        //         console.log('btnmore', btnmore);
        //         btnmore?.click()
        //         Array.from(document.querySelectorAll('.logistics_item_seller_left_rig')).forEach(item => {
        //             pagegoodname = item.querySelector('h3').textContent.replace(/[()-/:【】_-]/g, '').replace(/[\s\t\n：]/g, '')
        //             pagesku = item.querySelector('h6').textContent
        //             console.log('pagegoodname', pagegoodname, goodname, pagegoodname === goodname);
        //             console.log('pagesku', pagesku, sku, pagesku === sku);
        //             if (pagesku === sku && pagegoodname === goodname) {
        //                 console.log(666);
        //                 chrome.storage.local.set({
        //                     [key]: fastMail
        //                 })
        //                 isHas = true
        //                 return
        //             } else {
        //                 tabs[i].click()
        //             }
        //         })
        //     }
        // }
    } else if (content) {
        console.log('单包裹');
        const fastMail = document.querySelector('.detail').querySelectorAll('.item')[2].textContent.split(':')[1].replace(/[\s\t\n：]/g, '')
        const goodarr = Array.from(document.querySelectorAll('.logistics_item_seller_left_rig'))


        if (goodarr.length) {
            goodarr.forEach(item => {
                const pagegoodname = item.querySelector('h3').textContent
                const pagesku = item.querySelector('h6').textContent
                // console.log('pagegoodname', pagegoodname);
                // console.log('pagesku', pagesku);
                const isgoodname = goodname.split('').filter(item => {
                    return pagegoodname.includes(item)
                }).length == goodname.split('').length
                const issku = sku.split('').filter(item => {
                    return pagesku.includes(item)
                }).length == sku.split('').length
                console.log(isgoodname, issku);
                if (isgoodname && issku) {
                    console.log('抓取到快递单号', fastMail);
                    chrome.storage.local.set({ [key]: fastMail })
                }
                else {
                    console.log('未找到订单号~~~~~~');
                }
            })
        }




    }
} catch (error) {
    console.log(error);

}