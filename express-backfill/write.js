
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
        const btnclick = (i) => {
            btns.forEach((item, index) => {
                if (index == i) {
                    item.click()
                }
            })
        }
        models.forEach((model, index) => {
            const fastMailInput = model.querySelectorAll('input')[1]
            fastMailInput.value = model.dataset.fastMail
            btnclick(index)
        })
    } else {
        console.log('iframe not found');
    }
} catch (error) {

}
