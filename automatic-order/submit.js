
try {

    let goodlength
    chrome.storage.local.get(['goodlength'], (result) => {

        goodlength = result.goodlength
        console.log(goodlength);
    })
    console.log('goodlength', goodlength);

    const submitClick = (domSubmitBtn) => {
        setTimeout(() => {
            if (goodlength > 0) {
                // domSubmitBtn.click();
                console.log('提交订单中！');
                chrome.storage.local.set({ isbuy: 0 }, () => {
                    console.log('购买状态：当前购买结束');
                })
                chrome.storage.local.set({ goodlength: goodlength - 1 }, () => {
                    console.log('待购数量-1');
                })
                chrome.storage.local.set({ goodNum: 0 }, () => {
                    console.log('购买数量清空');
                })
                chrome.storage.local.set({ goodTypeArr: null }, () => {
                    console.log('购买类型清空');
                })

            }
        }, 1000);
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                domSubmitBtn = document.querySelector('.btn--QDjHtErD') || document.querySelector('.submitOrder-container');
                if (domSubmitBtn) {
                    console.log('提交按钮', domSubmitBtn);
                    submitClick(domSubmitBtn);
                    observer.disconnect();
                    break
                }
            }
        }
    })
    observer.observe(document, {
        attributes: true, // 观察属性变化
        childList: true, // 观察子节点变化
        subtree: true // 观察所有后代节点
    });

} catch (error) {

}