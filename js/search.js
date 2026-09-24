document.addEventListener("DOMContentLoaded", async ()=>{
  const form=document.getElementById("searchForm");
  const input=document.getElementById("searchInput");
  const results=document.getElementById("searchResults");
  const loading=document.getElementById("loading");
  const empty=document.getElementById("emptyState");
  const title=document.getElementById("resultsTitle");
  const info=document.getElementById("resultsInfo");

  const q=new URLSearchParams(location.search).get("q");
  if(q){input.value=q; await runSearch(q);}

  form.addEventListener("submit",async e=>{
    e.preventDefault();
    const query=input.value.trim();
    if(!query)return;
    history.replaceState(null,"",`search.html?q=${encodeURIComponent(query)}`);
    await runSearch(query);
  });

  async function runSearch(query){
    loading.classList.remove("hidden");
    empty.classList.add("hidden");
    results.innerHTML="";
    title.textContent=`Results for "${query}"`;
    info.textContent="";
    try{
      const movies=await searchMovies(query);
      window.currentMovies=movies;
      if(movies.length){
        results.innerHTML=movies.map(movieCard).join("");
        info.textContent=`${movies.length} result${movies.length===1?"":"s"}`;
        attachFavouriteButtons(results);
      }else empty.classList.remove("hidden");
    }catch(err){
      empty.querySelector("h3").textContent="Search could not be completed";
      empty.querySelector("p").textContent="Check your internet connection or API key.";
      empty.classList.remove("hidden");
    }finally{loading.classList.add("hidden");}
  }
});
