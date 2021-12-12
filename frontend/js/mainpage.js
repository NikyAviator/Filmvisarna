// Methoderna för "sidorna" / hashlinkarna  ---
// I den här methoden så visas framsidan med posterna.
function mainPage() {
    showMoviePosters();
}

// Post movies from JSON , kallas även när filmer skall display
async function showMoviePosters() {
    // Make a fetch to our namesearch route to get a search result
    let result = await (await fetch('/json/movies.json')).json();
    console.log(result);
    displaySearchResult(result);
}

// "Framsidans" posters läst från JSON filen movies. En "sub-method" för showMoviePosters()
async function displaySearchResult(movies) {
    //alert("displaySearchResult");
    // If no persons found report that
    if (movies.length === 0) {
        alert.log('Err');
        return;
    }

    let html = '<div class="container">';
    html += '<div class="row justify-content-md-center">';
    let x = 1;

    for (let { id, title, images } of movies) {
        html += `
      <div class="col-lg-4 col-md-6 mt-2 gap-3">
      <a href="#film-${x}">
      <img style="border: 15px ridge darkred; border-radius: 15px" src="images/Poster-${id}.jpg" alt="" height="400px" width="280px" />
      </a>
      </div>
      `;

        x = x + 1;
    }

    html += '</div>';
    html += '</div>';

    $('.mainContent').html(html);
}
