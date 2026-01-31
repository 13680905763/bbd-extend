
try {


    const iframes = document.querySelectorAll('iframe');
    const iframe = iframes[iframes.length - 1];

    if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        // 获取modal
        const modals = Array.from(iframeDocument.querySelectorAll('.layui-layer-iframe')).map(item => {
            const table = item.querySelector('iframe').contentDocument.querySelector('form table')
            table.dataset.overseas = item.dataset.overseas
            return table
        })
        console.log('modals', modals);

        modals.forEach(item => {
            item.querySelector('.addexpressno').click()
            item.querySelectorAll('input')[0].value = item.dataset.overseas
        })
        // console.log(models);
        Array.from(iframeDocument.querySelectorAll('.layui-layer-iframe')).forEach(item => {
            const btn = item.querySelector('.btn-success')
            btn.click()
        })
        // const closebtns = Array.from(iframeDocument.querySelectorAll('.layui-layer-iframe')).map(item => {
        //     const btn = item.querySelector('.layui-layer-close')
        //     return btn
        // })
        // const btnclick = (i) => {
        //     btns.forEach((item, index) => {
        //         if (index == i) {
        //             item.click()
        //         }
        //     })
        // }
        // const closebtnclick = (i) => {
        //     closebtns.forEach((item, index) => {
        //         if (index == i) {
        //             item.click()
        //         }
        //     })
        // }
        // models.forEach((model, index) => {
        //     const fastMailInput = model.querySelectorAll('input')[1]

        //     if (fastMailInput) {
        //         fastMailInput.value = model.dataset.fastMail
        //         btnclick(index)
        //     } else {
        //         // 如果拿不到
        //         console.log('close!!!');
        //         closebtnclick(index)
        //     }
        // })
    } else {
        console.log('iframe not found');
    }
} catch (error) {

}
