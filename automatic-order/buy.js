try {
    // 设置购买状态为购买中
    chrome.storage.local.set({ isbuy: 1 })

    // 获取待购数量 商品类型
    let goodlength
    let goodTypes = null
    let goodNum = null
    chrome.storage.local.get('goodlength', (result) => {
        goodlength = result.goodlength
    })
    chrome.storage.local.get(['goodTypeArr'], (result) => {
        if (chrome.runtime.lastError) {
            console.error('Error retrieving goodTypeArr:', chrome.runtime.lastError);
            return;
        } else {
            goodTypes = result.goodTypeArr;
            console.log('goodTypeArr', goodTypes);
        }
    });
    chrome.storage.local.get(['goodNum'], (result) => {
        if (chrome.runtime.lastError) {
            console.error('Error retrieving goodTypeArr:', chrome.runtime.lastError);
            return;
        } else {
            goodNum = result.goodNum;
            console.log('goodNum', goodNum);
        }
    });
    // 定义商品类型是否已选 
    let typeClick = false
    let domGoodTypes = null // 商品类型
    let domNum = null // 商品数量
    let domBtn = null // 购买按钮

    const selectGoodTypeAndNum = (domTypes, domNumAdd, domNum) => {
        setTimeout(() => {
            goodTypes.forEach((goodType, index) => {
                domTypes.forEach((domType, indey) => {
                    if (domType.textContent == goodType) {
                        typeClick = true
                        domType.click()
                    }
                    if (index == goodTypes.length - 1 && indey == domTypes.length - 1 && !typeClick) {
                        alert('没有找到类型')
                        chrome.storage.local.set({ isbuy: 0 }, () => {
                            console.log('isbuy is save');
                        })
                        chrome.storage.local.set({ goodlength: goodlength - 1 }, () => {
                            console.log('goodlength is save');
                        })
                    }
                })
            })
            for (let i = 1; i < goodNum; i++) {
                domNumAdd.click()
            }
        }, 500)
    }


    const submitBuy = (domBtn) => {
        setTimeout(() => {
            domBtn.click()
        }, 1000)
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            domGoodTypes = document.querySelector('.E7gD8doUq1--SkuContent--_4079867')
            domNumAdd = document.querySelector('.E7gD8doUq1--addBtn--_75c2f69')
            domNum = document.querySelector('.E7gD8doUq1--countValue--_14c0d78')
            domBtn = document.querySelector('.E7gD8doUq1--LeftButtonList--_21fe567')
                || document.querySelector('.E7gD8doUq1--LeftButtonListForEmphasize--fe9c6f7e ')
            if (mutation.type === 'childList') {
                console.log('dom change');
                if (domGoodTypes && domBtn && domNum && domNumAdd) {
                    domBtn = Array.from(domBtn.querySelectorAll('span')).filter(item => {
                        return item.textContent.includes('购买')
                    })[0]
                    domGoodTypes = Array.from(domGoodTypes.querySelectorAll('span'))
                    console.log('商品类型', domGoodTypes);
                    console.log('商品数量', domNumAdd, domNum);
                    console.log('购买按钮', domBtn);
                    selectGoodTypeAndNum(Array.from(domGoodTypes), domNumAdd, domNum)
                    submitBuy(domBtn)
                    observer.disconnect();
                    break
                }


            }
        }
    });
    // 开始观察目标节点
    observer.observe(document, {
        attributes: true, // 观察属性变化
        childList: true, // 观察子节点变化
        subtree: true // 观察所有后代节点
    });


} catch (error) {
    console.error('错误了！！！:', error);
}
