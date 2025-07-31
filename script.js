let selectedAvatar = null;

function selectAvatar(img) {
  document.querySelectorAll('.avatars img').forEach(el => el.classList.remove('selected'));
  img.classList.add('selected');
  selectedAvatar = img.src;
}

function saveProfile() {
  const name = document.getElementById("profile-name").value;
  const genre = document.getElementById("fav-genre").value;
  if (!name || !genre || !selectedAvatar) {
    alert("Fill everything in bestie! 💅");
    return;
  }

  const profile = { name, genre, avatar: selectedAvatar };
  localStorage.setItem("baddieProfile", JSON.stringify(profile));

  updateProfileUI(profile);
  switchScene('profile-editor', 'profile-holder');
}

function updateProfileUI(profile) {
  document.getElementById("profile-slot").innerHTML = `
    <img src="\${profile.avatar}" class="selected" style="width:80px; border-radius:50%">
    <h3>\${profile.name}</h3>
    <p>Fave Genre: \${profile.genre}</p>
    <button onclick="goToProfileEditor()">Edit Profile</button>
  `;
}

function goToProfileHolder() {
  switchScene('start-screen', 'profile-holder');
}

function goToProfileEditor() {
  switchScene('profile-holder', 'profile-editor');
}

function switchScene(fromId, toId) {
  document.getElementById(fromId).classList.remove("active");
  document.getElementById(toId).classList.add("active");
}

window.onload = function () {
  const saved = localStorage.getItem("baddieProfile");
  if (saved) updateProfileUI(JSON.parse(saved));
};

async function changeLang(language) {
  const res = await fetch(\`lang/\${language}.json\`);
  const translations = await res.json();

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[key]) el.innerText = translations[key];
  });
}
