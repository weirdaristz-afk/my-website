// GLOBALS
let currentUser = null; // { name: string, myList: [], watched: [] }
const movieData = [
  { id: 1, title: "Slay or Die", genre: "Horror", category: "all", img: "images/movie1.jpg", description: "A dark tale of survival and sass." },
  { id: 2, title: "Love & Glitter", genre: "Romance", category: "all", img: "images/movie2.jpg", description: "Sparkly love story with drama and glam." },
  { id: 3, title: "Dance Fever", genre: "Musical", category: "all", img: "images/movie3.jpg", description: "Get your groove on in this musical blast." },
  { id: 4, title: "Comedy Night", genre: "Comedy", category: "all", img: "images/movie4.jpg", description: "Laugh out loud with this baddie comedy." },
  { id: 5, title: "Kiddo Fun", genre: "Kids", category: "kids", img: "images/movie5.jpg", description: "Wholesome fun for the little stars." }
];

// DOM elements
const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const welcomeText = document.getElementById("welcome-text");
const moviesContainer = document.getElementById("movies-container");
const sectionHeader = document.getElementById("section-header");

const moviePopup = document.getElementById("movie-popup");
const popupImg = document.getElementById("popup-img");
const popupTitle = document.getElementById("popup-title");
const popupDescription = document.getElementById("popup-description");
const addMyListBtn = document.getElementById("add-mylist-btn");
const markWatchedBtn = document.getElementById("mark-watched-btn");
const closePopupBtn = document.getElementById("close-popup");

const usernameInput = document.getElementById("username-input");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

const categoryButtons = document.querySelectorAll(".category-btn");

// Save user to localStorage
function saveUser() {
  if (!currentUser) return;
  localStorage.setItem(`user_${currentUser.name}`, JSON.stringify(currentUser));
}

// Load user from localStorage or create new
function loadUser(name) {
  const data = localStorage.getItem(`user_${name}`);
  if (!data) {
    return { name, myList: [], watched: [] };
  }
  return JSON.parse(data);
}

// Show movies filtered by category
function displayMovies(category = "all") {
  moviesContainer.innerHTML = "";
  let filteredMovies = [];

  if (category === "all") {
    filteredMovies = movieData;
    sectionHeader.innerText = "All Movies";
  } else if (category === "mylist") {
    filteredMovies = movieData.filter(m => currentUser.myList.includes(m.id));
    sectionHeader.innerText = "My List";
  } else if (category === "recent") {
    filteredMovies = movieData.filter(m => currentUser.watched.includes(m.id));
    sectionHeader.innerText = "Recent Movies";
  } else if (category === "kids") {
    filteredMovies = movieData.filter(m => m.category === "kids");
    sectionHeader.innerText = "Kids Side";
  } else {
    filteredMovies = movieData.filter(m => m.category === category);
  }

  filteredMovies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="${movie.img}" alt="${movie.title}" />
      <div class="movie-info">${movie.title}</div>
    `;
    card.addEventListener("click", () => openMoviePopup(movie));
    moviesContainer.appendChild(card);
  });
}

// Open movie popup
function openMoviePopup(movie) {
  popupImg.src = movie.img;
  popupTitle.innerText = movie.title;
  popupDescription.innerText = movie.description;

  addMyListBtn.style.display = currentUser.myList.includes(movie.id) ? "none" : "inline-block";
  markWatchedBtn.style.display = currentUser.watched.includes(movie.id) ? "none" : "inline-block";

  addMyListBtn.onclick = () => {
    if (!currentUser.myList.includes(movie.id)) {
      currentUser.myList.push(movie.id);
      saveUser();
      displayMovies(getCurrentCategory());
      openMoviePopup(movie);
    }
  };

  markWatchedBtn.onclick = () => {
    if (!currentUser.watched.includes(movie.id)) {
      currentUser.watched.push(movie.id);
      saveUser();
      displayMovies(getCurrentCategory());
      openMoviePopup(movie);
    }
  };

  moviePopup.classList.remove("hidden");
}

// Close popup
closePopupBtn.onclick = () => {
  moviePopup.classList.add("hidden");
};

// Get active category
function getCurrentCategory() {
  return document.querySelector(".category-btn.active")?.dataset.category || "all";
}

// Login
loginBtn.onclick = () => {
  const username = usernameInput.value.trim();
  if (!username) {
    alert("Gimme your name, queen! 💅");
    return;
  }
  currentUser = loadUser(username);
  welcomeText.innerText = `Hey, ${currentUser.name}! 👑`;
  loginScreen.classList.remove("active");
  appScreen.classList.add("active");
  displayMovies();
};

// Logout
logoutBtn.onclick = () => {
  currentUser = null;
  usernameInput.value = "";
  loginScreen.classList.add("active");
  appScreen.classList.remove("active");
  moviesContainer.innerHTML = "";
};

// Category button clicks
categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    if (!currentUser) return;
    displayMovies(btn.dataset.category);
  });
});
