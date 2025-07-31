// Globals
let selectedAvatar = null;
let currentLang = "en";
let profile = null;
let movies = [];
let myList = [];
let watchAgain = [];

// Sample movie data (could be loaded from a JSON file in a real app)
movies = [
  {id:1, title:"Slay or Die", genre:"Horror", category:"movies", img:"images/movie1.jpg"},
  {id:2, title:"Love & Glitter", genre:"Romance", category:"movies", img:"images/movie2.jpg"},
  {id:3, title:"Dance Fever", genre:"Musical", category:"movies", img:"images/movie3.jpg"},
  {id:4, title:"Comedy Night", genre:"Comedy", category:"movies", img:"images/movie4.jpg"},
  {id:5, title:"Kiddo Fun", genre:"Kids", category:"kids", img:"images/movie5.jpg"}
];

// --- INTRO ANIMATION ---
window.addEventListener("load", () => {
  setTimeout(() => {
    const intro = document.getElementById("intro-overlay");
    intro.style.opacity = "0";
    setTimeout(() => intro.style.display = "none", 1500);
  }, 4000);
});

// --- PROFILE FUNCTIONS ---
function selectAvatar(img) {
  document.querySelectorAll('.avatars img').forEach(el => el.classList.remove('selected'));
  img.classList.add('selected');
  selectedAvatar = img.src;
}

function saveProfile() {
  const name = document.getElementById("profile-name").value.trim();
  const genre = document.getElementById("fav-genre").value;
  if (!name || !genre || !selectedAvatar) {
    alert("Fill everything in bestie! 💅");
    return;
  }
  profile = { name, genre, avatar: selectedAvatar };
  localStorage.setItem("baddieProfile", JSON.stringify(profile));
  updateProfileUI();
  closeProfileEditor();
}

function updateProfileUI() {
  const slot = document.getElementById("profile-display");
  if (!profile) {
    slot.innerHTML = `
      <p data-i18n="noProfile">No profile yet...</p>
      <button onclick="openProfileEditor()" data-i18n="createProfile">Create Profile</button>
    `;
  } else {
    slot.innerHTML = `
      <img src="${profile.avatar}" style="width:80px; border-radius:50%">
      <h3>${profile.name}</h3>
      <p>Fave Genre: ${profile.genre}</p>
      <button onclick="openProfileEditor()" data-i18n="editProfileBtn">Edit Profile</button>
    `;
  }
}

function openProfileEditor() {
  switchScene("profile-holder", "profile-editor");
  if(profile) {
    document.getElementById("profile-name").value = profile.name;
    document.getElementById("fav-genre").value = profile.genre;
    selectAvatar([...document.querySelectorAll('.avatars img')].find(img => img.src === profile.avatar));
  } else {
    document.getElementById("profile-name").value = "";
    document.getElementById("fav-genre").value = "";
    selectedAvatar = null;
    document.querySelectorAll('.avatars img').forEach(img => img.classList.remove('selected'));
  }
}

function closeProfileEditor() {
  switchScene("profile-editor", "profile-holder");
}

function switchScene(fromId, toId) {
  document.getElementById(fromId).classList.remove("active");
  document.getElementById(toId).classList.add("active");
}

// --- LANGUAGE FUNCTIONS ---
async function changeLang(lang) {
  currentLang = lang;
  const res = await fetch(`lang/${lang}.json`);
  const translations = await res.json();
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[key]) el.innerText = translations[key];
  });
}

// --- MOVIE DISPLAY & FILTERING ---
function displayMovies(filterCategory = "all") {
  const container = document.getElementById("movies-container");
  container.innerHTML = "";

  let filteredMovies;
  if (filterCategory === "all") filteredMovies = movies;
  else if (filterCategory === "mylist") filteredMovies = movies.filter(m => myList.includes(m.id));
  else if (filterCategory === "watchagain") filteredMovies = movies.filter(m => watchAgain.includes(m.id));
  else if (filterCategory === "kids") filteredMovies = movies.filter(m => m.category === "kids");
  else filteredMovies = movies.filter(m => m.category === filterCategory);

  // Group movies by genre
  const genres = [...new Set(filteredMovies.map(m => m.genre))];

  genres.forEach(genre => {
    const sep = document.createElement("div");
    sep.className = "genre-separator";
    sep.textContent = genre;
    container.appendChild(sep);

    filteredMovies.filter(m => m.genre === genre).forEach(m => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
        <img src="${m.img}" alt="${m.title}" />
        <div class="movie-info">${m.title}</div>
      `;
      container.appendChild(card);
    });
  });
}

// --- CATEGORY NAV BUTTONS ---
document.addEventListener("DOMContentLoaded", () => {
  displayMovies();

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      displayMovies(btn.dataset.category);
    });
  });

  // Load profile from storage
  const savedProfile = localStorage.getItem("baddieProfile");
  if (savedProfile) {
    profile = JSON.parse(savedProfile);
    updateProfileUI();
  }

  // Start language default
  changeLang(currentLang);

  // Setup holiday theme
  setupHolidayTheme();

  // Profile toggle nav button
  document.getElementById("profile-toggle-btn").addEventListener("click", () => {
    switchScene("main-content", "profile-holder");
  });
});

// --- HOLIDAY THEME SWITCH ---
function setupHolidayTheme() {
  const banner = document.getElementById("holiday-banner");
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  document.body.classList.remove("holiday-christmas", "holiday-halloween", "holiday-newyear");
  banner.textContent = "";

  // Christmas Dec 24-26
  if ((month === 12 && day >= 24) || (month === 12 && day <= 26)) {
    document.body.classList.add("holiday-christmas");
    banner.textContent = "🎄 Merry Christmas, Slay Queen! 🎄";
  }
  // Halloween Oct 30-31
  else if (month === 10 && (day === 30 || day === 31)) {
    document.body.classList.add("holiday-halloween");
    banner.textContent = "🎃 Spooky Slay Vibes Only! 🎃";
  }
  // New Year Jan 1-3
  else if (month === 1 && day <= 3) {
    document.body.classList.add("holiday-newyear");
    banner.textContent = "🎉 Happy New Year, Baddie! 🎉";
  }
}
