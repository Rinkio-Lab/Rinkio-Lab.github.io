/* ===== 统一主题持久化 ===== */
(function () {
    const body = document.body;
    const toggleBtn = document.getElementById('theme-toggle');
    const storageKey = 'theme';

    // 根据存储设置初始主题
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }

    // 切换主题
    function applyTheme(isDark) {
        body.classList.toggle('dark-theme', isDark);
        localStorage.setItem(storageKey, isDark ? 'dark' : 'light');
    }

    // 绑定切换按钮（首页 & 内页）
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            applyTheme(!body.classList.contains('dark-theme'));
        });
    }

    // 侧边导航的主题切换按钮
    const toggleBtnSidenav = document.getElementById('theme-toggle-sidenav');
    if (toggleBtnSidenav) {
        toggleBtnSidenav.addEventListener('click', () => {
            applyTheme(!body.classList.contains('dark-theme'));
        });
    }
})();

/* ===== 首页 Tab 与平滑滚动 ===== */
document.addEventListener('DOMContentLoaded', () => {
    // 初始化侧边导航
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    // Tab 切换
    document.querySelectorAll('.tab-trigger').forEach(link => {
        link.addEventListener('click', e => {
            document.querySelectorAll('.tab-trigger').forEach(el => el.classList.remove('active'));
            e.target.classList.add('active');
            const target = e.target.getAttribute('href').slice(1);
            document.querySelectorAll('.tab-section').forEach(sec => sec.classList.add('hide'));
            document.getElementById(target).classList.remove('hide');
        });
    });

    // Hero 阅读博客按钮平滑滚动
    document.querySelectorAll('a.js-scroll[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;

            // 切换到对应 Tab
            document.querySelectorAll('.tab-trigger').forEach(el => el.classList.remove('active'));
            document.querySelector(`[href="${a.getAttribute('href')}"]`)?.classList.add('active');
            document.querySelectorAll('.tab-section').forEach(s => s.classList.add('hide'));
            target.classList.remove('hide');

            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // 根据字符串生成一致的颜色
    function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    }

    // 应用随机颜色到标签
    document.querySelectorAll('.chip:not(.tag-common):not(.ultramarine)').forEach(chip => {
        const text = chip.textContent.trim();
        chip.style.backgroundColor = stringToColor(text);
        chip.style.color = 'white'; // 确保文字颜色为白色以保持可读性
    });

    // 为文章内页的<code>添加复制按钮
    document.querySelectorAll('pre code').forEach(codeBlock => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.textContent = '复制';

        copyButton.addEventListener('click', () => {
            const textToCopy = codeBlock.textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyButton.textContent = '已复制!';
                setTimeout(() => {
                    copyButton.textContent = '复制';
                }, 2000);
            }).catch(err => {
                console.error('复制失败: ', err);
            });
        });

        const pre = codeBlock.parentNode;
        if (pre && pre.tagName === 'PRE') {
            pre.style.position = 'relative'; // 确保pre标签是定位父元素
            pre.appendChild(copyButton);
        }
    });

    // 文章头图“抽屉”功能
    document.querySelectorAll('.article .img-container').forEach(container => {
        const img = container.querySelector('img');
        const expandButton = container.querySelector('.expand-button');

        if (img && expandButton) {
            // 检查图片是否超出容器，如果超出则显示展开按钮
            img.onload = () => {
                if (img.naturalHeight > container.clientHeight) {
                    expandButton.style.display = 'block';
                }
            };

            expandButton.addEventListener('click', () => {
                container.classList.toggle('expanded');
                if (container.classList.contains('expanded')) {
                    expandButton.textContent = '收起全图';
                } else {
                    expandButton.textContent = '展开全图';
                }
            });
        }
    });

    // 插入格言块
    quoteHtml = "<ruby>怒<rp>(</rp><rt>いか</rt><rp>)</rp></ruby>りも<ruby>喜<rp>(</rp><rt>よろこ</rt><rp>)</rp></ruby>びも<ruby>哀<rp>(</rp><rt>かな</rt><rp>)</rp></ruby>しさも <ruby>全部<rp>(</rp><rt>ぜんぶ</rt><rp>)</rp></ruby>ぶちこめ。"

    // 仅在首页显示
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        const quoteBlock = document.querySelector("#hero > div > p");
        if (quoteBlock) {
            quoteBlock.innerHTML = quoteHtml;
        }
    }

    // 打字机效果
    const messages = ["Hello!", "你好!", "こんにちは!", "¡Hola!", "Bonjour!", "안녕하세요!", "Привет!", "Ciao!", "Olá!"];
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 150; // 打字速度 (ms)
    const deletingSpeed = 100; // 删除速度 (ms)
    const pauseTime = 1500; // 暂停时间 (ms)

    const typewriterElement = document.getElementById('typewriter');
    const ghostElement = document.getElementById('ghost');

    async function typeWriterEffect() {
        const currentMessage = messages[messageIndex];

        if (!isDeleting) {
            // 打字
            typewriterElement.textContent = currentMessage.substring(0, charIndex);
            ghostElement.textContent = currentMessage;
            charIndex++;
            if (charIndex > currentMessage.length) {
                isDeleting = true;
                await new Promise(resolve => setTimeout(resolve, pauseTime));
            }
        } else {
            // 删除
            typewriterElement.textContent = currentMessage.substring(0, charIndex);
            charIndex--;
            if (charIndex < 0) {
                isDeleting = false;
                messageIndex = (messageIndex + 1) % messages.length;
                await new Promise(resolve => setTimeout(resolve, typingSpeed));
            }
        }

        setTimeout(typeWriterEffect, isDeleting ? deletingSpeed : typingSpeed);
    }

    if (typewriterElement && ghostElement) {
        typeWriterEffect();
    }

    // 初始化 Masonry 布局
    const grid = document.querySelector('.grid');
    if (grid) {
        const msnry = new Masonry(grid, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-item',
            percentPosition: true
        });

        // 确保图片加载完成后重新布局
        imagesLoaded(grid).on('progress', function() {
            msnry.layout();
        });
    }

    function measureTextWidth(text, baseEl) {
        const temp = document.createElement("span");
        temp.style.position = "absolute";
        temp.style.visibility = "hidden";
        temp.style.whiteSpace = "nowrap";
        temp.style.font = getComputedStyle(baseEl).font;
        temp.textContent = text;
        document.body.appendChild(temp);
        const width = temp.offsetWidth;
        document.body.removeChild(temp);
        return width;
    }

    function typeText(el, targetText, callback, speed = 50) {
        let index = 0;
        el.classList.add('animating');

        function type() {
            if (index <= targetText.length) {
                el.textContent = targetText.slice(0, index);
                index++;
                setTimeout(type, speed);
            } else {
                el.classList.remove('animating');
                callback && callback();
            }
        }

        type();
    }

    function deleteText(el, originalText, callback, speed = 30) {
        let index = el.textContent.length;
        el.classList.add('animating');

        function erase() {
            if (index > 0) {
                el.textContent = originalText.slice(0, index);
                index--;
                setTimeout(erase, speed);
            } else {
                el.textContent = originalText; // 🛠️ 最后确保设置为完整缩写
                el.classList.remove('animating');
                callback && callback();
            }
        }

        erase();
    }

    document.querySelectorAll('.abbr-typing').forEach(el => {
        const short = el.dataset.short;
        const full = el.dataset.full;

        // 初始化宽度：设置为两者最大宽度，避免动画中跳动
        const maxWidth = Math.max(
            measureTextWidth(short, el),
            measureTextWidth(full, el)
        );
        el.style.minWidth = `${maxWidth}px`;

        el.addEventListener('mouseenter', () => {
            if (el.textContent !== full && !el.classList.contains('animating')) {
                typeText(el, full);
            }
        });

        el.addEventListener('mouseleave', () => {
            if (el.textContent !== short && !el.classList.contains('animating')) {
                deleteText(el, short);
            }
        });
    });
});

