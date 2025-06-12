try {
    const params = new URLSearchParams(window.location.search)
    const order = params.get('order')
    const fee = params.get('fee')
    console.log('key', order, fee);



    // const input = document.querySelector('.Filter--inputId--JmjL4fX').querySelector('input')
    // const btn = document.querySelector('form button')
    // console.log(input, btn);

    const intervalInit = setInterval(() => {
        // 监听search按钮加载
        const searchbtn = document.querySelector('button[name="commonSearch"]')
        console.log(searchbtn);
        if (searchbtn) {
            clearInterval(intervalInit)
            searchbtn.click()

            const forminputele = Array.from(document.querySelectorAll('.form-group'))[0].querySelectorAll('input')[1]
            const formbtnele = document.querySelector('.btn-success')
            console.log('forminputele', forminputele);
            console.log('formbtnele', formbtnele);
            forminputele.value = order
            formbtnele.click()
        }
    }, 1000);
    const intervalInit1 = setInterval(() => {
        // 监听search按钮加载
        const title = table.querySelector('thead')?.querySelectorAll('th')
        const tbody = table.querySelector('tbody')?.querySelectorAll('td')
        if (title && tbody && title.length == tbody.length) {
            clearInterval(intervalInit1)

            let bIndex
            let pIndex
            title.forEach((title, index) => {
                if (title.textContent == '包裹编号') {
                    bIndex = index
                }
                if (title.textContent == '运费支出') {
                    pIndex = index
                }

            })
            console.log(bIndex, pIndex);
            console.log('拿到表格', title, tbody);
            if (tbody[bIndex].textContent === order) {
                console.log('包裹编号一致');
                if (tbody[pIndex].querySelector('a').textContent !== fee) {

                    console.log('费用不一致开始填入');
                    tbody[pIndex].querySelector('a').click()
                    tbody[pIndex].querySelector('input').value = fee
                    tbody[pIndex].querySelector('button[type="submit"]').click()
                }

            }

            // searchbtn.click()

            // const forminputele = Array.from(document.querySelectorAll('.form-group'))[0].querySelectorAll('input')[1]
            // const formbtnele = document.querySelector('.btn-success')
            // console.log('forminputele', forminputele);
            // console.log('formbtnele', formbtnele);
            // forminputele.value = order
            // formbtnele.click()
        }
    }, 1000);





    // function getData() {
    //     const interval = setInterval(() => {
    //         // 监听table加载
    //         const table = document.querySelector('.Table--orderItemWraper--vfIxDrh')
    //         // console.log(table);
    //         if (table) {
    //             clearInterval(interval)
    //             // 获取更多
    //             const btn = document.querySelector('.LoadMore--loadMore--gVFbml7 button')
    //             btn?.click()
    //             if (btn) {
    //                 getData()
    //             } else {
    //                 // console.log('没有更多了');
    //                 const goodItems = Array.from(document.querySelectorAll('.Content--colStatus--F9DfIjZ')).filter(item => {
    //                     return item.querySelector('.Section--colStatus--AZq0YyG').textContent.includes('已发货')
    //                 })
    //                 console.log('goodItems:', goodItems);
    //                 try {
    //                     goodItems.forEach(item => {
    //                         console.log('item1', item);

    //                         const wrp = Array.from(item.querySelectorAll('.ProductCard--proDes--fMqofqf'))
    //                         console.log('wrp', wrp);

    //                         const fastMail = item.querySelector('.Content--inlineCopy--K37VC0Q').textContent.replace(/[\s\t\n：]/g, '')
    //                         console.log('fastMail', fastMail);

    //                         const pagegoodname = item.querySelector('.ProductCard--productName--JI6r0s_').textContent
    //                         const pagesku = wrp[0].querySelector('span').textContent

    //                         const pageorder = wrp[3].textContent.split(':')[1].replace(/[\s\t\n：]/g, '')
    //                         console.log('pageinfo', pagegoodname, pagesku, pageorder);

    //                         const isgoodname = goodname.split('').filter(item => {
    //                             return pagegoodname.includes(item)
    //                         }).length == goodname.split('').length
    //                         const issku = sku.split('').filter(item => {
    //                             return pagesku.includes(item)
    //                         }).length == sku.split('').length
    //                         const isorder = order == pageorder
    //                         console.log('isgoodname', isgoodname, 'issku', issku, 'isorder', isorder);
    //                         if (isorder && isgoodname && issku) {
    //                             console.log('抓取到快递单号', fastMail);
    //                             chrome.storage.local.set({ [key]: fastMail })
    //                         }
    //                         else {
    //                             console.log('未找到订单号~~~~~~');
    //                         }
    //                     })
    //                 } catch (error) {
    //                     console.log(error);

    //                 }

    //             }
    //         }
    //     }, 1000);

    //     setTimeout(() => {
    //         clearInterval(interval)
    //     }, 10000);
    // }

} catch (error) {
    console.log(error);

}




