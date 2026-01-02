
try {
    // 获取url
    const url = window.location.href;
    console.log(url);

    const iframes = document.querySelectorAll('iframe');
    const iframe = iframes[iframes.length - 1];
    // console.log(iframe);

    if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        // console.log(iframeDocument);

        // 获取modal
        const models = Array.from(iframeDocument.querySelectorAll('.layui-layer-iframe')).map(item => {
            const tbodys = item.querySelector('iframe').contentDocument.querySelector('form tbody')
            tbodys.dataset.fastMail = item.dataset.fastMail
            return tbodys
        })
        console.log(models);
        const btns = Array.from(iframeDocument.querySelectorAll('.layui-layer-iframe')).map(item => {
            const btn = item.querySelector('.btn-success')
            return btn
        })
        const closebtns = Array.from(iframeDocument.querySelectorAll('.layui-layer-iframe')).map(item => {
            const btn = item.querySelector('.layui-layer-close')
            return btn
        })
        const btnclick = (i) => {
            btns.forEach((item, index) => {
                if (index == i) {
                    item.click()
                }
            })
        }
        const closebtnclick = (i) => {
            closebtns.forEach((item, index) => {
                if (index == i) {
                    item.click()
                }
            })
        }
        models.forEach((model, index) => {
            const fastMailInput = model.querySelectorAll('input')[1]

            if (fastMailInput) {
                fastMailInput.value = model.dataset.fastMail
                btnclick(index)
            } else {
                // 如果拿不到
                console.log('close!!!');
                closebtnclick(index)
            }
        })
    } else {
        console.log('iframe not found');
    }
} catch (error) {

}
