// darkmode-btn.js

function createDarkModeButton() {
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
    .theme-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px;
        background-color: #0066cc;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 100;
        transition: background-color 0.3s, color 0.3s;
    }

    body.dark-theme .theme-toggle {
        background-color: #eee;
        color: #222;
    }
    `;
    document.head.appendChild(style);

    // 创建按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.id = 'theme-toggle';
    toggleBtn.innerText = '🌓';
    document.body.appendChild(toggleBtn);

    // 本地存储键名
    const storageKey = 'theme';

    // 设置初始主题
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    } else {
    document.body.classList.remove('dark-theme');
    }

    // 切换主题函数
    function applyTheme(isDark) {
    document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem(storageKey, isDark ? 'dark' : 'light');
    }

    // 按钮监听器
    toggleBtn.addEventListener('click', () => {
    applyTheme(!document.body.classList.contains('dark-theme'));
    });
};