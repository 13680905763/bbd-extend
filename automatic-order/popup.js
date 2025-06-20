document.getElementById('shop').addEventListener('click', () => {
  const urlPatterns = [
    'https://baobaoda.dev.1buyo.com/admin/order*',
    'https://bbdbuy.com/admin/order/goods*',
    // 添加更多 URL 模式
  ];
  injectScriptToMatchingTabs('shop.js', urlPatterns);
});

async function injectScriptToMatchingTabs(scriptFile, urlPattern) {
  try {
    const tabs = await chrome.tabs.query({ url: urlPattern, active: true, currentWindow: true });
    if (tabs.length === 0) {
      alert('请前往商品列表页进行自动下单');
      return;
    }
    await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: [scriptFile]
    });
    alert('自动下单功能已启动，请勿重复点击');
  } catch (error) {
    console.error(`Failed to inject ${scriptFile}:`, error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
});