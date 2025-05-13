const params = new URLSearchParams(window.location.search)
const order = params.get('oid')
const goodname = params.get('goodname')
const sku = params.get('sku')
const key = `${order}_${goodname}_${sku}`
console.log('key', key);


const tabs = Array.from(document.querySelectorAll('.package'))

const content = document.querySelector('.deliver_info')
const fastMail = document.querySelector('.detail').querySelectorAll('.item')[2].textContent.split(':')[1].replace(/[\s\t\n：]/g, '')





if (tabs.length) {
    let isHas = false;
    console.log('多包裹');

    try {

    } catch (error) {
        console.log(error);

    }
    for (let i = 0; i < tabs.length; i++) {
        if (!isHas) {


            const btnmore = document.querySelectorAll('.logistics_item_seller_see_more')[1]?.querySelector('p')
            console.log('btnmore', btnmore);
            btnmore?.click()
            Array.from(document.querySelectorAll('.logistics_item_seller_left_rig')).forEach(item => {
                pagegoodname = item.querySelector('h3').textContent.replace(/[()-/:【】_]/g, '').replace(/[\s\t\n：]/g, '')
                pagesku = item.querySelector('h6').textContent
                console.log('pagegoodname', pagegoodname, goodname, pagegoodname === goodname);
                console.log('pagesku', pagesku, sku, pagesku === sku);

                if (pagesku === sku && pagegoodname === goodname) {
                    console.log(666);
                    chrome.storage.local.set({
                        [key]: fastMail
                    })
                    isHas = true
                    return
                } else {
                    tabs[i].click()

                }
            })

        }



    }



} else if (content) {
    console.log('单包裹');
    const pagegoodname = document.querySelector('.logistics_item_seller_left_rig').querySelector('h3').textContent.replace(/[()-/:【】_]/g, '').replace(/[\s\t\n：]/g, '')
    const pagesku = document.querySelector('.logistics_item_seller_left_rig').querySelector('h6').textContent
    console.log('pagegoodname', pagegoodname, goodname, pagegoodname === goodname);
    console.log('pagesku', pagesku, sku, pagesku === sku);
    if (pagesku === sku && pagegoodname === goodname) {
        console.log('sku一致');
        chrome.storage.local.set({
            [key]: fastMail
        })

    }
}