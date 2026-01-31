document.getElementById('get').addEventListener('click', () => {
  const urlPatterns = [
    'https://baobaoda.dev.1buyo.com/admin/order*',
    'https://bbdbuy.com/admin/order/goods*',
    'https://bbdbuy.com/admins6e5zkx.php*',
    // 添加更多 URL 模式
  ];
  injectScriptToMatchingTabs('get.js', urlPatterns);
});
document.getElementById('open').addEventListener('click', () => {
  const urlPatterns = [
    'https://baobaoda.dev.1buyo.com/admin/order*',
    'https://bbdbuy.com/admin/order/goods*',
    'https://bbdbuy.com/admins6e5zkx.php*',

    // 添加更多 URL 模式
  ];
  injectScriptToMatchingTabs('open.js', urlPatterns);
});

document.getElementById('write').addEventListener('click', () => {
  const urlPatterns = [
    'https://baobaoda.dev.1buyo.com/admin/order*',
    'https://bbdbuy.com/admin/order/goods*',
    'https://bbdbuy.com/admins6e5zkx.php*',

    // 添加更多 URL 模式
  ];
  injectScriptToMatchingTabs('write.js', urlPatterns);
});
document.getElementById('check').addEventListener('click', () => {
  const urlPatterns = [
    'https://baobaoda.dev.1buyo.com/admin/order*',
    'https://bbdbuy.com/admin/order/goods*',
    'https://bbdbuy.com/admins6e5zkx.php*',
    // 添加更多 URL 模式
  ];
  injectScriptToMatchingTabs('check.js', urlPatterns);
});

document.getElementById('get_oversea').addEventListener('click', () => {
  const urlPatterns = [
    'https://baobaoda.dev.1buyo.com/admin/order*',
    'https://bbdbuy.com/admin/order/goods*',
    'https://bbdbuy.com/admins6e5zkx.php*',
  ];
  injectScriptToMatchingTabs('get_oversea.js', urlPatterns);
});

document.getElementById('write_oversea').addEventListener('click', () => {
  const urlPatterns = [
    'https://baobaoda.dev.1buyo.com/admin/order*',
    'https://bbdbuy.com/admin/order/goods*',
    'https://bbdbuy.com/admins6e5zkx.php*',
  ];
  injectScriptToMatchingTabs('write_oversea.js', urlPatterns);
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
