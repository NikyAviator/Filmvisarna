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
  }
  else if (pageToDisplay.indexOf('booking') === 0) {
    bookingPage();
    return;
  } else if (pageToDisplay.indexOf('show-my-tickets') === 0) {
    showMyTickets();
    return;
  } else if (pageToDisplay.indexOf('book-ticket') === 0) {
    bookTicket();
    return;
  }

  // ANNARS

  window[pageToDisplay]();
}

//# "SIDORNA"

async function showMyTickets() {

  let result = await (await fetch('/json/shows.json')).json();

  let film = result[0];

  console.log(film)
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
      <h2 class="text-dark">${film.film}</h2>
          <h3>Datum/Tid : ${film.time} </h3>
          <h3>Pris : 70kr </h3>
          <h3>Antal biljetter : </h3>
          <h3>Salong : ${film.auditorium} </h3>
          <p><small class="text-dark">Toalettkod : 5496</small></p>
      </div >
     </div >
    </div >
  `);


}

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

  // Spara sista klickade filmen för booking ref till att 
  // söka efter visningar på booking.
  //https://stackoverflow.com/questions/16206322/how-to-get-js-variable-to-retain-value-after-page-refresh
  localStorage.setItem("lastMovie", film.title);

  $('.mainContent').html(`

    <div class="container bg-dark text-white">
    <div class="row">
      <div class="col-3 me-auto">
        <img src="/images/Poster-${film.id
    }.jpg" class="img-fluid d-none d-sm-block">
      </div>
      <div class="col-md-7 col-xs-12 me-auto">
        <div class="ratio ratio-16x9">
          <iframe src="https://www.youtube.com/embed/${film.youtubeTrailers
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
            <p>${film.genre.join(', ')} | ${formatTime(
      film.length
    )} | Språk: ${film.language} | Text: ${film.subtitles}</p>
            <div class="description">
              <p>${film.description}</p>
            </div>
            <p>Regi: ${film.director}</p>
            <p>Skådespelare: ${film.actors.join(', ')}</p>
            <p>Distributör: ${film.distributor}</p>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        ${displayReviews(film.reviews)}
      </div>
    </div>
    `);
}

// Om man klickat på booking knappen innuit en films sida så hamnar man
// på booking sidan - ingen logiken ännu , ville bara visa hur jag expanderar på
// det vi redan har så det kanske är enklare att förstå.
async function bookingPage() {

  // WIP - WIP - WIP 
  // Tänkte vi kunde ha en kalender med noteringa för visningar för relevant film. 
  // markering av datum skapar en dropdown lista med tider för datumet.
  //---
  // refresh tar bort global vars så måste spara data i no konstant form. 

  // saves movies past refresh.
  var currentMovie = localStorage.getItem("lastMovie");

  /*
  // display
  $('.mainContent').html(`

<div class="container bg-dark text-white">
    <div class="row">
      <div class="col-3 me-auto">
          <h3 style="font-size:300%;">Shows</h3>
      </div>
    </div>

  <div class="showingsCalender">
  <div id="datepicker" data-date="30/12/2021">  </div>
  <input type="hidden" id="my_hidden_input">

  <input type="text" id="dateOutput"  placeholder="Selected show date">
  </div>


`);
*/

  $('.mainContent').html(`

<div class="container bg-dark text-white">

<div class="row no-gutters">
  <div class="col-12 col-sm-6 col-md-8">
    <div class="showingsCalender"> </div>
  <div id="datepicker" data-date="30/12/2021"></div>
  </div>
  <div class="col-6 col-md-4">
 <h3 style="font-size:300%;">Shows</h3>
 <a href="#book-ticket" class="btn btn-danger btn-lg mt-2" role="button" aria-pressed="true">See shows</a>
  </div>
</div>
`);

  // För klarhetens skull så skriver jag ut vilken film vi kollar på.
  $("#currMovie").attr("placeholder", currentMovie);

  let shows = await (await fetch('/json/shows.json')).json();

  if (shows.length === 0) {
    alert.log('No shows ?.');
    return;
  }

  let sorted = [];

  // sort based on 'film' -> date.
  for (let { film, date } of shows) {
    if (film.indexOf(currentMovie) === 0) {
      sorted.push(formatDate(date));
    }
  }

  // här kan vi fylla på med visnings datum från json.
  var active_dates = sorted;

  // visar datum med visning i grönt
  $("#datepicker").datepicker({
    format: "dd/mm/yyyy",
    autoclose: true,
    todayHighlight: false,
    beforeShowDay: function (date) {
      var d = date;
      var curr_date = d.getDate();
      var curr_month = d.getMonth() + 1; //Months are zero based
      var curr_year = d.getFullYear();
      var formattedDate = curr_date + "/" + curr_month + "/" + curr_year

      if ($.inArray(formattedDate, active_dates) != -1) {
        return {
          classes: 'activeClass'
        };
      }
      return;
    }
  });

  //Event : Visar bara vart man klickat sist.
  $('#datepicker').on('changeDate', function () {

    let date = $('#datepicker').data('datepicker').viewDate;
    $("#dateOutput").attr("placeholder", date);
  }
  );
}

// Used by booking to convert dates within shows.json. "dd/mm/yyyy"
// Per stackoverflow https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  /* 
  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;
  */
  return [day, month, year].join('/');
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

function displayReviews(review) {
  let html = '';
  for (let i = 0; i < review.length; i++) {
    html += `<div class="col-md-4"> <div class="d-flex justify-content-center">`;
    for (let stars = 0; stars < review[i].max; stars++) {
      if (stars <= review[i].stars - 1) {
        html += `<img src="/images/icon-star-light.png" class="star">`;
      } else {
        html += `<img src="/images/icon-star-grey.png" class="star">`;
      }
    }
    html += `</div> <br> <p class="text-center">"${review[i].quote}"</p> 
              <p class="text-end">- ${review[i].source}</p> </div>`;
  }
  console.log(html);
  return html;
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

// Thomas event lyssnare från lektionen.
window.onhashchange = reactOnHashChange;
reactOnHashChange();
