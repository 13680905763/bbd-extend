
document.getElementById('open').addEventListener('click', () => {
  console.log(666);

  const urlPatterns = [
    'https://baobaoda.dev.1buyo.com/admin/sendorder/lists*',
    'https://bbdbuy.com/admin/order/goods*',
    'https://bbdbuy.com/admins6e5zkx.php*',

    // 添加更多 URL 模式
  ];
  injectScriptToMatchingTabs('open.js', urlPatterns);
});


async function injectScriptToMatchingTabs(scriptFile, urlPattern) {
  try {
    const tabs = await chrome.tabs.query({ url: urlPattern, active: true, currentWindow: true });
    if (tabs.length === 0) {
      alert('请前往商品列表页进行自动下单666');
      return;
    }
    await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: [scriptFile]
    });
    // alert('功能已启动，请勿重复点击');
  } catch (error) {
    console.error(`Failed to inject ${scriptFile}:`, error);
  }

}
document.getElementById('get').addEventListener('click', () => {
  const orderInfo = document.getElementById('orderInfo').value;
  const shippingFee = document.getElementById('shippingFee').value;
  // 模拟录入处理，比如打印到控制台
  console.log('订单信息:', orderInfo);
  console.log('运费:', shippingFee);
  // 拆分为数组
  const orderNumbers = orderInfo.trim().split(/\s+/);
  const shippingFees = shippingFee.trim().split(/\s+/);

  // 组装为对象
  const orderShippingMap = {};
  orderNumbers.forEach((order, index) => {
    if (order && shippingFees[index]) {

      orderShippingMap[order] = shippingFees[index] || null; // 防止不匹配时值为 undefined
    }
  });
  console.log('orderShippingMap', orderShippingMap);
  if (Object.keys(orderShippingMap).length > 0) {
    chrome.storage.local.set({ orderShippingMap }, () => {
      console.log("订单-运费映射已保存:", orderShippingMap);
    });
    alert('录入成功！')
  } else {
    alert('录入失败！')
  }

});