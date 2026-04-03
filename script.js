function getResumeById(id) {
  return resumes.find(item => item.id === id);
}

function createPhotoElement(photo, name, large = false) {
  const wrapper = document.createElement("div");
  wrapper.className = large ? "photo-box large" : "photo-box";

  if (photo) {
    const img = document.createElement("img");
    img.src = photo;
    img.alt = `${name}的照片`;
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

  resumes.forEach(person => {
    const card = document.createElement("a");
    card.className = "resume-card";
    card.href = `resume.html?id=${person.id}`;

    const photoEl = createPhotoElement(person.photo, person.name);

    const info = document.createElement("div");
    info.className = "resume-card-info";
    info.innerHTML = `
      <h2>${person.name}</h2>
      <p>${person.shortMajor || person.majorGrade}</p>
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

  const photoEl = createPhotoElement(person.photo, person.name, true);

  const experienceHtml = person.experience
    .map(item => `<li>${item}</li>`)
    .join("");

  const skillsHtml = person.skills
    .map(item => `<li>${item}</li>`)
    .join("");

  detail.innerHTML = `
    <div class="detail-card">
      <div class="detail-top">
        <div class="detail-basic">
          <h2>${person.name}</h2>
          <p><strong>年级专业：</strong>${person.majorGrade}</p>
        </div>
      </div>

      <div class="detail-photo-area"></div>

      <div class="detail-section">
        <h3>个人优势与自我评价</h3>
        <p>${person.selfEvaluation}</p>
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
        <p>${person.motivation}</p>
      </div>
    </div>
  `;

  const photoArea = detail.querySelector(".detail-photo-area");
  photoArea.appendChild(photoEl);
}

document.addEventListener("DOMContentLoaded", () => {
  renderIndexPage();
  renderResumePage();
});
