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
  let shows = await (await fetch('/json/shows.json')).json();

  if (result.length === 0) {
    alert.log('An error occurred trying to load movies data.');
    return;
  }

  // Här kan man ändra "sidan" när man klickat på en poster och innehållet visas.
  let film = result[id - 1];
  let booking = shows[id - 1];

  $('.mainContent').html(`

    <h1 style="color:white;">${film.title}</h1>
    <p style="color:white;">t.ex om man klickat en på poster på <a href="  https://www.filmstaden.se/film/NCG106319/ghostbusters-afterlife"> Link </a></p>
    <h2 style="color:white;>${film.title}</h2>
    <p style="color:white;>${film.description}</p>
    <img style="position:left" src="${film.images}">
    <a href="#booking" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">show</a>

   <a href="#booking1" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">
   ${booking.auditorium}<br>${booking.date}<br>${booking.time}</a>
    `);
}

// Om man klickat på booking knappen innuit en films sida så hamnar man
// på booking sidan - ingen logiken ännu , ville bara visa hur jag expanderar på
// det vi redan har så det kanske är enklare att förstå.
async function bookingPage() {
  // Här kan man ändra "sidan" när man klickat på en poster och innehållet visas.
  $('.mainContent').html(`
<h1 style="color:white;">Presenting all shows for</h1>
<h1 style="color:white;"> ${film.title}</h1>
<p style="color:white;"> Vi kanske kan visa visningar och biosalarna här </p>
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
    <img src="images/Poster-${id}.jpg" alt="" height="75%" width="auto" />
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
