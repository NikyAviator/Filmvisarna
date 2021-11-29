// Den här method körs varje gång något förändras på sidan. Våran navigering.
// *
// Fungerar lite some en "state machine" beronende på string så körs olika methoder.
// *
// OM pageToDisplay === film så har man klickat på en film poster.
// då kallas focusMovie(filmId);
// ELSE
function reactOnHashChange() {
  let pageToDisplay = location.hash || 'mainPage';
  pageToDisplay = pageToDisplay.replace('#', '');

  // OM vi klickat på en genererad hashlänk som börjar med
  // film så sök våran JSON fil
  if (pageToDisplay.indexOf('film') === 0) {
    let filmId = +pageToDisplay.split('-')[1];

    // JSON filmer ordning spelar roll de vill säga film är ID 1 etc ...
    // om det är ett problem så kan vi alltid lägga till ID is JSON struckturen och
    // söka efter som thomas gjorde
    // ie let film = movies.find(x => x.id == id);
    focusMovie(filmId);
    return;
  } else if (pageToDisplay.indexOf('booking') === 0) {
    bookingPage();
    return;
  } else if (pageToDisplay.indexOf('showTickets') === 0) {
    showMyTickets();
    return;
  }

  // ANNARS

  window[pageToDisplay]();
}

//# "SIDORNA"

// Methoderna för "sidorna" / hashlinkarna  ---
// I den här methoden så visas framsidan med posterna.
function mainPage() {
  showMoviePosters();
}

// Klickar man på en film poster så körs den här methoden.
async function focusMovie(id) {
  let result = await (await fetch('/json/movies.json')).json();

  if (result.length === 0) {
    alert.log('An error occurred trying to load movies data.');
    return;
  }

  // Här kan man ändra "sidan" när man klickat på en poster och innehållet visas.
  let film = result[id - 1];

  $('.mainContent').html(`

    <div class="container bg-dark text-white">
    <div class="row">
      <div class="col-3 me-auto">
        <img src="/images/Poster-${
          film.id
        }.jpg" class="img-fluid d-none d-sm-block">
      </div>
      <div class="col-md-7 col-xs-12 me-auto">
        <div class="ratio ratio-16x9">
          <iframe src="https://www.youtube.com/embed/${
            film.youtubeTrailers
          }" title="YouTube video"
            allowfullscreen></iframe>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 me-md-auto mt-2">
          <a href="#booking" class="btn btn-danger btn-lg mt-2" role="button" aria-pressed="true">See shows</a>
        </div>
        <div class="col-md-7 me-auto mt-md-2">
          <div class="movieinfo mt-5">
            <h1>${film.title}</h1>
            <p>${formatArray(film.genre)} | ${formatTime(
    film.length
  )} | Språk: ${film.language} | Text: ${film.subtitles}</p>
            <div class="description">
              <p>${film.description}</p>
            </div>
            <p>Regi: ${film.director}</p>
            <p>Skådespelare: ${formatArray(film.actors)}</p>
            <p>Distributör: ${film.distributor}</p>
          </div>
        </div>
      </div>
    </div>
    `);
}

// Om man klickat på booking knappen innuit en films sida så hamnar man
// på booking sidan - ingen logiken ännu , ville bara visa hur jag expanderar på
// det vi redan har så det kanske är enklare att förstå.
async function bookingPage() {
  //let shows = await (await fetch('/json/shows.json')).json();

  //let booking = shows[id - 1];

  $('.mainContent').html(`
    <div class="container bg-dark text-white">
    <div class="row">
      <div class="col-3 me-auto">
        <h1>Pick your showing</h1>
        </div>

      <div class="col-md-7 col-xs-12 me-auto">
        <div class="ratio ratio-16x9">
        <div class="container">
        <div class="screen"></div>
          <div class="row">
            <div id="seat" class="seat"></div>
            <div id="seat" class="seat"></div>
            <div id="seat" class="seat"></div>
            <div id="seat" class="seat"></div>
            <div id="seat" class="seat"></div>
            <div id="seat" class="seat"></div>
            <div id="seat" class="seat"></div>
            <div id="seat" class="seat"></div>
          </div>
        </div>
      </div>
      </div>
    </div>
  `);
}

function formatArray(data) {
  let dataString = '';
  for (let x = 0; x < data.length; x++) {
    dataString += data[x];
    if (x < data.length - 1) dataString += ', ';
  }
  return dataString;
}
function formatTime(minutes) {
  let timeString = '';
  let restMinutes = minutes % 60;
  let hours = (minutes - restMinutes) / 60;
  timeString =
    (hours > 0 ? hours + ' tim ' : '') +
    (restMinutes > 0 ? restMinutes + ' min' : '');
  return timeString;
}

async function showMyTickets() {
  $('.mainContent').html(`

    <div class="container bg-dark text-white">
    <div class="row">
      <div class="col-md-3 mx-auto">
              <h1>Your tickets</h1>
      </div> 
     </div>
     <div class="row">
     
      <div id="biljetten" class="col-md-6 mt-5 bg-danger text-white text mx-auto">
              <img src="images/newMovieLogo.svg" alt="Movie Logo" width="45" height="45"
          class="d-inline-block align-text-top" />
      <h2 class="text-dark">(Filmens namn)</h2>
          <h3>Datum/Tid : </h3>
          <h3>Pris : </h3>
          <h3>Antal biljetter : </h3>
          <h3>Platser : </h3>
          <p><small class="text-dark">Toalettkod : 5496</small></p>
      </div >
     </div >
    </div >
  `);
}
//# "SIDORNA"

// -----

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
    <div class="col-md-4 col-md-6 mt-2 gap-3">
    <a href="#film-${x}">
    <img src="images/Poster-${id}.jpg" alt="" height="400px" width="250px" />
    </a>
    </div>
    `;

    x = x + 1;
  }

  html += '</div>';
  html += '</div>';

  $('.mainContent').html(html);
}

// Thomas event lyssnare från lektionen.
window.onhashchange = reactOnHashChange;
reactOnHashChange();
