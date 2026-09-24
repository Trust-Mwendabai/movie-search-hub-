document.addEventListener("DOMContentLoaded", async ()=>{
  const grid=document.getElementById("featuredMovies");
  window.currentMovies=demoMovies;
  grid.innerHTML=demoMovies.slice(0,8).map(movieCard).join("");
  attachFavouriteButtons(grid);

  document.getElementById("homeSearch").addEventListener("submit",e=>{
    e.preventDefault();
    const q=document.getElementById("homeSearchInput").value.trim();
    if(q) window.location.href=`search.html?q=${encodeURIComponent(q)}`;
  });

  document.querySelectorAll("[data-query]").forEach(btn=>{
    btn.addEventListener("click",()=>window.location.href=`search.html?q=${encodeURIComponent(btn.dataset.query)}`);
  });
});
