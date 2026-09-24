/* Add your OMDb API key here for live movie data. */
const API_KEY = "41be50f1";

const demoMovies = [
  { Title: "Inception", Year: "2010", imdbID: "tt1375666", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzQ4ODg2Ml5BMl5BanBnXkFtZTcwMDI0ODQzMw@@._V1_SX300.jpg" },
  { Title: "Interstellar", Year: "2014", imdbID: "tt0816692", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3NzgtMTc0Mi00ZDQzLWEwNTUtNzM4ZTM4MTg5NTk0XkEyXkFqcGc@._V1_SX300.jpg" },
  { Title: "The Matrix", Year: "1999", imdbID: "tt0133093", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTU5NDgtYjQ4Zi00OTIzLTg1MzYtYjEwN2E4YjU5NTIzXkEyXkFqcGc@._V1_SX300.jpg" },
  { Title: "The Dark Knight", Year: "2008", imdbID: "tt0468569", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTM3MzQ0MV5BMl5BanBnXkFtZTcwMDgxMTc3Mg@@._V1_SX300.jpg" },
  { Title: "Avatar", Year: "2009", imdbID: "tt0499549", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNjczYjY4NjctYjA4OS00ZTRhLWE0NzktYjRjMjQ5NzM4OWY0XkEyXkFqcGc@._V1_SX300.jpg" },
  { Title: "The Avengers", Year: "2012", imdbID: "tt0848228", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTk0MDk0NjYzNl5BMl5BanBnXkFtZTcwMDg0NTYyNw@@._V1_SX300.jpg" },
  { Title: "Toy Story", Year: "1995", imdbID: "tt0114709", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMGEzMC00YjU2LWE0OWYtNjg0ZTUxODJmOTM2XkEyXkFqcGc@._V1_SX300.jpg" },
  { Title: "The Godfather", Year: "1972", imdbID: "tt0068646", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtNDYzMC00NmE1LTg2YzItZDRiZDUxMGU1ODI2XkEyXkFqcGc@._V1_SX300.jpg" }
];

function getFavourites() {
  try { return JSON.parse(localStorage.getItem("movieHubFavourites")) || []; }
  catch (e) { return []; }
}
function saveFavourites(items) {
  localStorage.setItem("movieHubFavourites", JSON.stringify(items));
  updateFavouriteCount();
}
function updateFavouriteCount() {
  const el = document.getElementById("favCount");
  if (el) el.textContent = getFavourites().length;
}
function isFavourite(id) { return getFavourites().some(m => m.imdbID === id); }

function toggleFavourite(movie) {
  let items = getFavourites();
  if (items.some(m => m.imdbID === movie.imdbID)) {
    items = items.filter(m => m.imdbID !== movie.imdbID);
  } else {
    items.push(movie);
  }
  saveFavourites(items);
  return items.some(m => m.imdbID === movie.imdbID);
}

function movieCard(movie) {
  const poster = movie.Poster && movie.Poster !== "N/A"
    ? `<img src="${movie.Poster}" alt="${escapeHTML(movie.Title)} poster" onerror="this.parentElement.innerHTML='<div class=&quot;poster-placeholder&quot;>🎬</div>'">`
    : `<div class="poster-placeholder">🎬</div>`;
  const fav = isFavourite(movie.imdbID);
  return `<article class="movie-card">
    <a href="movie.html?id=${encodeURIComponent(movie.imdbID)}">
      <div class="poster-wrap">${poster}</div>
    </a>
    <div class="movie-info">
      <div class="movie-title" title="${escapeHTML(movie.Title)}">${escapeHTML(movie.Title)}</div>
      <div class="movie-meta">${escapeHTML(movie.Year || "Unknown")} • ${escapeHTML(movie.Type || "Movie")}</div>
      <div class="card-actions">
        <a class="small-button primary" href="movie.html?id=${encodeURIComponent(movie.imdbID)}">Details</a>
        <button class="small-button fav-btn" data-id="${movie.imdbID}">${fav ? "♥ Saved" : "♡ Save"}</button>
      </div>
    </div>
  </article>`;
}
function attachFavouriteButtons(container) {
  container.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const movie = window.currentMovies?.find(m => m.imdbID === id) || getFavourites().find(m => m.imdbID === id) || demoMovies.find(m => m.imdbID === id);
      if (movie) {
        const saved = toggleFavourite(movie);
        btn.textContent = saved ? "♥ Saved" : "♡ Save";
      }
    });
  });
}
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
}
async function searchMovies(query) {
  query = query.trim();
  if (!query) return [];
  if (API_KEY && API_KEY !== "YOUR_OMDB_API_KEY") {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${encodeURIComponent(API_KEY)}&s=${encodeURIComponent(query)}&type=movie`);
    const data = await res.json();
    if (data.Response === "True") return data.Search;
    return [];
  }
  const q = query.toLowerCase();
  return demoMovies.filter(m => m.Title.toLowerCase().includes(q));
}
async function getMovie(id) {
  if (API_KEY && API_KEY !== "YOUR_OMDB_API_KEY") {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${encodeURIComponent(API_KEY)}&i=${encodeURIComponent(id)}&plot=full`);
    const data = await res.json();
    if (data.Response === "True") return data;
  }
  return demoMovies.find(m => m.imdbID === id) || null;
}
function setupMenu() {
  const toggle = document.getElementById("menuToggle"), nav = document.getElementById("mainNav");
  if (toggle && nav) toggle.addEventListener("click", () => nav.classList.toggle("open"));
}
document.addEventListener("DOMContentLoaded", () => { updateFavouriteCount(); setupMenu(); });
