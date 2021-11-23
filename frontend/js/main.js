
// Hash på Thomas vis.
function reactOnHashChange() {
  let pageToDisplay = location.hash || 'mainPage';
  pageToDisplay = pageToDisplay.replace('#', '');

  // OM vi klickat på en genererad hashlänk som börjar med 
  // film så sök våran JSON fil
  if (pageToDisplay.indexOf('film') === 0) {

    $('.focusBody').hide();
    $('.focus').show();

    let filmId = +pageToDisplay.split('-')[1];

    // JSON filmer ordning spelar roll de vill säga film är ID 1 etc ... 
    // om det är ett problem så kan vi alltid lägga till ID is JSON struckturen och 
    // söka efter som thomas gjorde 
    // ie let film = movies.find(x => x.id == id);
    focusMovie(filmId);
    return;
  }
  // ANNARS inte så kan vi visa filmerna från JSON 
  // vi kan utöka detta sedan beronend på vart 
  // man är på "sidan"

  $('.focus').hide();
  $('.focusBody').show();

  window[pageToDisplay]();
}

// Post movies from JSON , kallas även när filmer skall display
async function initMovieData() {
  // Make a fetch to our namesearch route to get a search result
  let result = await (await fetch('/json/movies.json')).json();
  console.log(result);
  displaySearchResult(result);
}

async function displaySearchResult(movies) {

  //alert("displaySearchResult");
  // If no persons found report that
  if (movies.length === 0) {
    alert.log("Err");
    return;
  }

  let html = '<div class="container">';
  html += '<div class="row gy-4">';
  let x = 1;

  for (let { title } of movies) {

    html += `
    <div class="col-md-4 ml-auto">
    <a href="#film-${x}">
    <img src="images/The_Matrix_Poster.jpg" alt="" height="75%" width="auto" />
    </a>
    </div>
    `;

    x = x + 1;
  }

  html += '</div>';
  html += '</div>';

  $('.focusBody').html(html);
}

// Main movie display area. Huvudsida - vi kan sedan skapa methoder för boking , userpage etc. 
function mainPage() {

  $('.main').html(`
    <h1> Main shows all movies </h1>
    <p> Tim : methoden är till för a visa filmerna från JSON på "framsidan" eller huvudsidan. </p>
  `);

  initMovieData();
}

// Vad som skall visas i focus body.
async function focusMovie(id) {

  // pga att vi kollar på en specifik gömmer vi innehållet från 
  // "framsidan"
  $('.focusBody').hide();

  let result = await (await fetch('/json/movies.json')).json();

  if (result.length === 0) {
    alert.log("An error occurred trying to load movies data.");
    return;
  }

  // Här han vi lägga till en massa tasks för reviews, booknings knapp , möjliga visningar 
  // eftersom vi vet vilken film //ID kunden är på. 
  //..
  // Ändrade description för exemple filmer för att lättare se att det är JSON 
  // filen vi läser från ; hade kopierat första om/igen. 
  let film = result[id - 1];
  $('.focus').html(`
    <h1> FocusBody </h1>
    <p> Tim : Tänkte att  vi kunde ha mesta dels informationen,trailers etc om filmen i frågan här samt boknings knapp etc </p>
    <h2>${film.title}</h2>
    <p>${film.description}</p>
  `);
}

// Thomas event lyssnare från lektionen.
window.onhashchange = reactOnHashChange;
reactOnHashChange();