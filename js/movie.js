document.addEventListener("DOMContentLoaded", async ()=>{
  const container=document.getElementById("movieDetails");
  const id=new URLSearchParams(location.search).get("id");
  if(!id){
    container.innerHTML=`<div class="empty"><div>🎬</div><h3>Movie not selected</h3><p>Return to search and select a movie.</p><a class="button" href="search.html">Search Movies</a></div>`;
    return;
  }
  try{
    const movie=await getMovie(id);
    if(!movie){
      container.innerHTML=`<div class="empty"><div>🔎</div><h3>Movie not found</h3><a class="button" href="search.html">Back to Search</a></div>`;
      return;
    }
    window.currentMovies=[movie];
    const poster=movie.Poster && movie.Poster!=="N/A"
      ? `<img src="${movie.Poster}" alt="${escapeHTML(movie.Title)} poster" referrerpolicy="no-referrer">`
      : `<div class="poster-placeholder">🎬</div>`;
    const favourite=isFavourite(movie.imdbID);
    container.innerHTML=`
      <div>
        <a class="back" href="search.html">← Back to Search</a>
        <div class="detail-poster">${poster}</div>
      </div>
      <div class="detail-content">
        <p class="eyebrow">${escapeHTML(movie.Type || "MOVIE")}</p>
        <h1>${escapeHTML(movie.Title)}</h1>
        <div class="detail-meta">
          <span class="tag">${escapeHTML(movie.Year || "N/A")}</span>
          <span class="tag">${escapeHTML(movie.Runtime || "N/A")}</span>
          <span class="tag">${escapeHTML(movie.Genre || "N/A")}</span>
          <span class="tag rating">★ ${escapeHTML(movie.imdbRating || "N/A")}</span>
        </div>
        <p class="plot">${escapeHTML(movie.Plot || "Detailed plot information is available when a live OMDb API key is configured.")}</p>
        <div class="detail-list">
          <div><strong>Director</strong>${escapeHTML(movie.Director || "N/A")}</div>
          <div><strong>Actors</strong>${escapeHTML(movie.Actors || "N/A")}</div>
          <div><strong>Language</strong>${escapeHTML(movie.Language || "N/A")}</div>
          <div><strong>Country</strong>${escapeHTML(movie.Country || "N/A")}</div>
          <div><strong>Released</strong>${escapeHTML(movie.Released || movie.Year || "N/A")}</div>
          <div><strong>Awards</strong>${escapeHTML(movie.Awards || "N/A")}</div>
        </div>
        <div class="detail-actions">
          <button id="favMovieBtn" class="button">${favourite ? "♥ Remove from Favourites" : "♡ Add to Favourites"}</button>
          <a class="button" href="search.html">Search Again</a>
        </div>
      </div>`;
    document.getElementById("favMovieBtn").addEventListener("click",e=>{
      const saved=toggleFavourite(movie);
      e.currentTarget.textContent=saved ? "♥ Remove from Favourites" : "♡ Add to Favourites";
    });
  }catch(err){
    container.innerHTML=`<div class="empty"><div>⚠</div><h3>Something went wrong</h3><p>Please try again.</p></div>`;
  }
});
