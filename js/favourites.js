document.addEventListener("DOMContentLoaded",()=>{
  const grid=document.getElementById("favouritesGrid");
  const empty=document.getElementById("favouriteEmpty");
  render();

  function render(){
    const movies=getFavourites();
    window.currentMovies=movies;
    if(!movies.length){
      grid.innerHTML="";
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    grid.innerHTML=movies.map(movieCard).join("");
    grid.querySelectorAll(".fav-btn").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const movie=movies.find(m=>m.imdbID===btn.dataset.id);
        if(movie) toggleFavourite(movie);
        render();
      });
    });
  }
});
