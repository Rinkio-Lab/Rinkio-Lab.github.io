// modal-img.js

(function () {
    // 创建并注入 CSS 样式
    const style = document.createElement("style");
    style.textContent = `
    .modal-img-trigger {
      border-radius: 5px;
      cursor: pointer;
      transition: 0.3s;
    }

    .modal-img-trigger:hover {
      opacity: 0.7;
    }

    .modal-img-container {
      display: none;
      position: fixed;
      z-index: 9999;
      padding-top: 100px;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.9);
    }

    .modal-img-content {
      margin: auto;
      display: block;
      width: 80%;
      max-width: 700px;
      animation: zoom 0.6s;
    }

    .modal-img-caption {
      margin: auto;
      display: block;
      width: 80%;
      max-width: 700px;
      text-align: center;
      color: #ccc;
      padding: 10px 0;
      height: 150px;
      animation: zoom 0.6s;
    }

    @keyframes zoom {
      from {transform:scale(0)}
      to {transform:scale(1)}
    }

    .modal-img-close {
      position: absolute;
      top: 15px;
      right: 35px;
      color: #f1f1f1;
      font-size: 40px;
      font-weight: bold;
      transition: 0.3s;
      cursor: pointer;
    }

    .modal-img-close:hover {
      color: #bbb;
    }

    @media only screen and (max-width: 700px) {
      .modal-img-content {
        width: 100%;
      }
    }
  `;
    document.head.appendChild(style);

    // 创建 Modal 元素结构
    const modal = document.createElement("div");
    modal.className = "modal-img-container";
    modal.innerHTML = `
    <span class="modal-img-close">&times;</span>
    <img class="modal-img-content" id="modalImgContent">
    <div class="modal-img-caption" id="modalImgCaption"></div>
  `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector("#modalImgContent");
    const captionText = modal.querySelector("#modalImgCaption");
    const closeBtn = modal.querySelector(".modal-img-close");

    // 点击关闭 Modal
    closeBtn.onclick = () => {
        modal.style.display = "none";
    };

    // 自动为所有 class="preview" 的图片添加点击事件
    const images = document.querySelectorAll("img.preview");
    images.forEach(img => {
        img.classList.add("modal-img-trigger");

        img.addEventListener("click", () => {
            modal.style.display = "block";
            modalImg.src = img.src;
            captionText.textContent = img.alt || "（无描述）";
        });
    });
})();
