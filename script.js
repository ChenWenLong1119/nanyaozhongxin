function safeText(value) {
  return value ? value : "暂无信息";
}

function safeArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim() !== "") return [value];
  return [];
}

function getResumeById(id) {
  if (!Array.isArray(resumes)) return null;
  return resumes.find(item => item.id === id) || null;
}

function createPhotoElement(photo, name, large = false) {
  const wrapper = document.createElement("div");
  wrapper.className = large ? "photo-box large" : "photo-box";

  if (photo && typeof photo === "string" && photo.trim() !== "") {
    const img = document.createElement("img");
    img.src = photo;
    img.alt = `${name || "人物"}的照片`;
    img.onload = function () {
      wrapper.innerHTML = "";
      wrapper.appendChild(img);
    };
    img.onerror = function () {
      wrapper.innerHTML = `<div class="photo-placeholder">？</div>`;
    };
    wrapper.appendChild(img);
  } else {
    wrapper.innerHTML = `<div class="photo-placeholder">？</div>`;
  }

  return wrapper;
}

function renderIndexPage() {
  const cardList = document.getElementById("card-list");
  if (!cardList) return;

  if (!Array.isArray(resumes) || resumes.length === 0) {
    cardList.innerHTML = `<p class="empty-tip">暂无简历数据</p>`;
    return;
  }

  cardList.innerHTML = "";

  resumes.forEach(person => {
    const card = document.createElement("a");
    card.className = "resume-card";
    card.href = `resume.html?id=${encodeURIComponent(person.id || "")}`;

    const photoEl = createPhotoElement(person.photo, person.name);

    const info = document.createElement("div");
    info.className = "resume-card-info";

    const name = safeText(person.name);
    const major = safeText(person.shortMajor || person.majorGrade);

    info.innerHTML = `
      <h2>${name}</h2>
      <p>${major}</p>
    `;

    card.appendChild(photoEl);
    card.appendChild(info);
    cardList.appendChild(card);
  });
}

function renderResumePage() {
  const detail = document.getElementById("resume-detail");
  if (!detail) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const person = getResumeById(id);

  if (!person) {
    detail.innerHTML = `
      <div class="detail-card">
        <h2>未找到该简历</h2>
        <p>请返回首页重新选择。</p>
      </div>
    `;
    return;
  }

  const name = safeText(person.name);
  const majorGrade = safeText(person.majorGrade);
  const selfEvaluation = safeText(person.selfEvaluation);
  const motivation = safeText(person.motivation);
  const experienceArr = safeArray(person.experience);
  const skillsArr = safeArray(person.skills);

  const experienceHtml = experienceArr.length
    ? experienceArr.map(item => `<li>${item}</li>`).join("")
    : "<li>暂无相关经历</li>";

  const skillsHtml = skillsArr.length
    ? skillsArr.map(item => `<li>${item}</li>`).join("")
    : "<li>暂无技能特长</li>";

  detail.innerHTML = `
    <div class="detail-card">
      <div class="detail-top">
        <div class="detail-basic">
          <h2>${name}</h2>
          <p><strong>年级专业：</strong>${majorGrade}</p>
        </div>
        <div class="detail-photo-area"></div>
      </div>

      <div class="detail-section">
        <h3>个人优势与自我评价</h3>
        <p>${selfEvaluation}</p>
      </div>

      <div class="detail-section">
        <h3>相关经历</h3>
        <ul>${experienceHtml}</ul>
      </div>

      <div class="detail-section">
        <h3>技能特长</h3>
        <ul>${skillsHtml}</ul>
      </div>

      <div class="detail-section">
        <h3>参与社会实践的动机与期望</h3>
        <p>${motivation}</p>
      </div>
    </div>
  `;

  const photoArea = detail.querySelector(".detail-photo-area");
  const photoEl = createPhotoElement(person.photo, person.name, true);
  photoArea.appendChild(photoEl);
}

document.addEventListener("DOMContentLoaded", function () {
  try {
    renderIndexPage();
    renderResumePage();
  } catch (error) {
    console.error("页面渲染出错：", error);

    const cardList = document.getElementById("card-list");
    const detail = document.getElementById("resume-detail");

    if (cardList) {
      cardList.innerHTML = `<p class="empty-tip">页面加载失败，请检查 data.js 或 script.js 是否有语法错误。</p>`;
    }

    if (detail) {
      detail.innerHTML = `
        <div class="detail-card">
          <h2>页面加载失败</h2>
          <p>请检查 data.js 或 script.js 是否存在语法错误。</p>
        </div>
      `;
    }
  }
});
