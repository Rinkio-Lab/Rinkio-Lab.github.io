import { clickEffect } from './click-effect.js'; // 引入点击效果脚本

document.addEventListener('DOMContentLoaded', function () {
    clickEffect({
        maxBallSize: 16,
        decayRate: 0.25,
        longPressThreshold: 400, // 自定义长按时间
    });

    // ===== 外链跳转功能 =====
    const urlParams = new URLSearchParams(window.location.search);
    const targetUrl = urlParams.get('target');
    const debugMode = urlParams.get('debug') === 'true';
    const currentDomain = window.location.hostname;

    // 匹配内网域名或 IP
    const isInternalDomain = /(^127\.0\.0\.1$|^(10|172\.16|192\.168)\.|^localhost$)/;

    if (targetUrl) {
        let fixedUrl = targetUrl;
        if (!/^https?:\/\//.test(targetUrl)) {
            fixedUrl = 'http://' + targetUrl;
        }

        try {
            const targetHostname = new URL(fixedUrl).hostname;
            const isInternal = isInternalDomain.test(targetHostname);
            const currentTopLevel = currentDomain.split('.').slice(-2).join('.');
            const targetTopLevel = targetHostname.split('.').slice(-2).join('.');
            const isSameTopLevel = currentTopLevel === targetTopLevel;

            const easterEggs = [
                {
                    pattern: /google\.com(\.|$)/,
                    title: '即将前往 Google 域名',
                    message: '该链接可能、也许、大概率不会不安全，请放心访问吧~',
                    extraHTML: '<img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google Logo" style="margin-bottom: 10px;">'
                },
                {
                    pattern: /youtube\.com(\.|$)/,
                    title: '🎬 即将前往 YouTube 域名',
                    message: '准备好探索视频宇宙了吗？',
                    extraHTML: '<img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" style="width: 120px; margin-bottom: 10px;">'
                },
                {
                    pattern: /girls-band-cry\.com(\.|$)/,
                    title: 'GIRLS BAND CRY',
                    message: '愤怒也好喜悦也好悲伤也好，把一切都倾注进去。 ——GIRLS BAND CRY<br><br>你说得对，但是《少女乐队的呐喊》（日语：ガールズバンドクライ，英语：Girls Band Cry）是东映动画制作，酒井和男执导的2024年原创日本电视动画，是东映动画、agehasprings与环球音乐（日本）主办的同名跨媒体制作企划的一部分。该企划以agehasprings的五人女子乐队“Togenashi Togeari”（日语：トゲナシトゲアリ，又译作无刺有刺）为主体，本作也以该乐队为原型创作，五名乐队成员分别饰演动画中的五位主角。',
                    extraHTML: `<img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Girls_Band_Cry_logo.png" 
                                    alt="GIRLS BAND CRY" 
                                    class="preview"
                                    style="width: 80%; margin-bottom: 10px; background-color: #fff; padding: 10px; border-radius: 8px;">
                                `
                }
            ];

            let customTitle = '即将跳转到外部链接';
            let customMessage = '该链接可能包含不安全内容，请谨慎操作。';
            let customExtraHTML = '';
            let backgroundImage = [];

            for (const egg of easterEggs) {
                if (egg.pattern.test(targetHostname)) {
                    customTitle = egg.title;
                    customMessage = egg.message;
                    customExtraHTML = egg.extraHTML || '';
                    backgroundImage = egg.backgroundImage || [];
                    break;
                }
            }

            if (!debugMode && (isInternal || isSameTopLevel)) {
                window.location.href = fixedUrl;
                return;
            }

            document.getElementById('targetUrl').textContent = fixedUrl;
            document.querySelector('h1').textContent = customTitle;
            document.querySelectorAll('p')[1].innerHTML = customMessage;
            document.getElementById('extraContent').innerHTML = customExtraHTML;

            if (debugMode) {
                const debugInfo = document.createElement('div');
                debugInfo.style.marginTop = '20px';
                debugInfo.style.textAlign = 'left';
                debugInfo.innerHTML = `
              <hr>
              <h3>🛠️ 调试信息：</h3>
              <p><strong>当前域名：</strong> ${currentDomain}</p>
              <p><strong>目标域名：</strong> ${targetHostname}</p>
              <p><strong>是否内网地址：</strong> ${isInternal}</p>
              <p><strong>顶级域名是否相同：</strong> ${isSameTopLevel}</p>
              <p><strong>是否开启 debug 模式：</strong> ${debugMode}</p>
            `;
                document.querySelector('.container').appendChild(debugInfo);
            }

            document.getElementById('confirmBtn').addEventListener('click', function () {
                window.location.href = fixedUrl;
            });

            document.getElementById('cancelBtn').addEventListener('click', function () {
                window.history.back();
            });

        } catch (err) {
            document.querySelector('.container').innerHTML = `
            <h1>错误</h1>
            <p>无效的目标链接：${targetUrl}</p>
            <pre>${err}</pre>
            <button onclick="window.history.back()">返回</button>
          `;
        }

    } else {
        document.querySelector('.container').innerHTML = `
          <h1>错误</h1>
          <p>未找到目标链接参数。</p>
          <button onclick="window.history.back()">返回</button>
        `;
    }
});
