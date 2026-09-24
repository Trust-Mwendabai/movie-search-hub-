document.addEventListener("DOMContentLoaded", async ()=>{
  const grid=document.getElementById("featuredMovies");
  const featured=demoMovies.slice(0,8);

  function render(movies){
    window.currentMovies=movies;
    grid.innerHTML=movies.map(movieCard).join("");
    attachFavouriteButtons(grid);
  }

  // Show the built-in catalogue instantly, then refresh it with live OMDb data (fresh posters).
  render(featured);
  try{
    const live=await Promise.all(featured.map(m=>getMovie(m.imdbID)));
    render(live.map((m,i)=>m
      ? {Title:m.Title,Year:m.Year,imdbID:m.imdbID,Type:m.Type,Poster:m.Poster}
      : featured[i]));
  }catch(e){ /* keep the demo catalogue */ }

  document.getElementById("homeSearch").addEventListener("submit",e=>{
    e.preventDefault();
    const q=document.getElementById("homeSearchInput").value.trim();
    if(q) window.location.href=`search.html?q=${encodeURIComponent(q)}`;
  });

  document.querySelectorAll("[data-query]").forEach(btn=>{
    btn.addEventListener("click",()=>window.location.href=`search.html?q=${encodeURIComponent(btn.dataset.query)}`);
  });
});
