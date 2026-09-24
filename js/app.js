/* Add your OMDb API key here for live movie data. */
const API_KEY = "41be50f1";

const demoMovies = [
  { Title: "Inception", Year: "2010", imdbID: "tt1375666", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg" },
  { Title: "Interstellar", Year: "2014", imdbID: "tt0816692", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg" },
  { Title: "The Matrix", Year: "1999", imdbID: "tt0133093", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg" },
  { Title: "The Dark Knight", Year: "2008", imdbID: "tt0468569", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg" },
  { Title: "Avatar", Year: "2009", imdbID: "tt0499549", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMDEzMmQwZjctZWU2My00MWNlLWE0NjItMDJlYTRlNGJiZjcyXkEyXkFqcGc@._V1_SX300.jpg" },
  { Title: "The Avengers", Year: "2012", imdbID: "tt0848228", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNGE0YTVjNzUtNzJjOS00NGNlLTgxMzctZTY4YTE1Y2Y1ZTU4XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg" },
  { Title: "Toy Story", Year: "1995", imdbID: "tt0114709", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BZTA3OWVjOWItNjE1NS00NzZiLWE1MjgtZDZhMWI1ZTlkNzYwXkEyXkFqcGc@._V1_SX300.jpg" },
  { Title: "The Godfather", Year: "1972", imdbID: "tt0068646", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_QL75_UY562_CR8,0,380,562_.jpg" }
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
    ? `<img src="${movie.Poster}" alt="${escapeHTML(movie.Title)} poster" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.innerHTML='<div class=&quot;poster-placeholder&quot;>🎬</div>'">`
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
function setupTheme() {
  const header = document.querySelector(".navbar"), menu = document.getElementById("menuToggle");
  if (!header || !menu) return;
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const btn = document.createElement("button");
  btn.className = "theme-toggle";
  btn.type = "button";
  const wrap = document.createElement("div");
  wrap.className = "nav-actions";
  menu.replaceWith(wrap);
  wrap.append(btn, menu);
  const apply = theme => {
    root.setAttribute("data-theme", theme);
    btn.textContent = theme === "light" ? "🌙" : "☀️";
    btn.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
    if (meta) meta.setAttribute("content", theme === "light" ? "#ffffff" : "#0a0c14");
  };
  apply(root.getAttribute("data-theme") === "light" ? "light" : "dark");
  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    apply(next);
    try { localStorage.setItem("movieHubTheme", next); } catch (e) {}
  });
}
function setupMenu() {
  const toggle = document.getElementById("menuToggle"), nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;
  toggle.setAttribute("aria-label", "Toggle navigation menu");
  toggle.setAttribute("aria-controls", "mainNav");
  toggle.setAttribute("aria-expanded", "false");
  const setOpen = open => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "✕" : "☰";
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  nav.addEventListener("click", e => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
  window.matchMedia("(min-width:800px)").addEventListener("change", e => { if (e.matches) setOpen(false); });
}
document.addEventListener("DOMContentLoaded", () => { updateFavouriteCount(); setupTheme(); setupMenu(); });
