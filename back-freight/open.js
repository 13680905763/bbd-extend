

try {
    console.log(6666);
    function showCustomConfirm(message, onConfirm, onCancel) {
        // 如果已存在，先移除
        const existing = document.getElementById('custom-confirm-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'custom-confirm-modal';
        modal.innerHTML = `
    <style>
      #custom-confirm-modal {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }
      .confirm-box {
        background: white;
        padding: 16px 24px;
        border-radius: 6px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        font-family: sans-serif;
      }
      .confirm-message {
        margin-bottom: 16px;
        user-select: text;
        word-break: break-word;
      }
      .confirm-buttons {
        text-align: right;
      }
      .confirm-buttons button {
        margin-left: 8px;
        padding: 6px 12px;
      }
    </style>
    <div class="confirm-box">
      <div class="confirm-message">${message}</div>
      <div class="confirm-buttons">
        <button id="custom-cancel-btn">取消</button>
        <button id="custom-ok-btn">确认</button>
      </div>
    </div>
  `;
        document.body.appendChild(modal);

        document.getElementById('custom-ok-btn').onclick = () => {
            modal.remove();
            onConfirm?.();
        };

        document.getElementById('custom-cancel-btn').onclick = () => {
            modal.remove();
            onCancel?.();
        };
    }
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


                    let message = "请核对订单与运费信息：<br/>";

                    for (const [order, fee] of Object.entries(data.orderShippingMap)) {
                        message += `${order}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${fee}<br/>`;
                    }


                    showCustomConfirm(
                        message,
                        () => {
                            for (const [order, fee] of Object.entries(data.orderShippingMap)) {
                                message += `${order} → ¥${fee}\n`;
                                const params = new URLSearchParams({
                                    order,
                                    fee
                                });
                                window.open(`https://bbdbuy.com/admins6e5zkx.php/sendorder/lists?${params.toString()}`, '_blank');
                            }
                        },
                        () => console.log('用户取消')
                    );



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
