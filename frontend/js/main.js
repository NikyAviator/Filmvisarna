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
  } else if (pageToDisplay.indexOf('show-my-tickets') === 0) {
    showMyTickets();
    return;
  } else if (pageToDisplay.indexOf('book-ticket') === 0) {
    //bookTicket();
    return;
  }


  // ANNARS

  window[pageToDisplay]();
}


// För Anton och Gustav backend ! Spara till JSON booking. OBS selectedSeats är
// en array.
//
// # - Om object finns i booking.json fyll på de nya tagna stolplatserna
// ANNARS
// # om objectet inte finns i bookings så skapa det.
// Tim
async function processPayment(movieName, auditorium, date, time, selectedSeats) {
  alert("movieName : " + movieName + " auditorium : " + auditorium + " date : " + date + " time : " + time + " selected Seats " + selectedSeats)
}

//# "SIDORNA"

async function showMyTickets() {
  let result = await (await fetch('/json/shows.json')).json();

  let film = result[0];

  console.log(film);
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
  localStorage.setItem('lastMovie', film.title);

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
            <p>${film.genre.join(', ')} | ${formatTime(film.length)} | Språk: ${film.language
    } | Text: ${film.subtitles}</p>
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

// Some interesting information.
// shows - date IS formated 23-12-2021
// datepicker date IS formated 23/12/2021.
async function bookingPage() {

  // Page presistance.
  // saves movies past refresh.
  let currentMovie = localStorage.getItem('lastMovie');
  let currentAuditorium = "ERR";
  let currentShowDate = "ERR";
  let currentShowtime = "ERR";
  // Just a WIP idea of how selected seats will be saved. 
  let currentSelectedSeats = [10, 11, 8, 4];

  if (localStorage.getItem("lastShowDate") === null) {
    alert("Error lastShowDate not found in local storage.")
    // Should be set todays date - if we havent visited the site 
    // before.
    currentShowDate = "2021-12-1"; // mock date.
  }
  else {
    // It exist - good
    currentShowDate = localStorage.getItem('lastShowDate');
  }

  if (localStorage.getItem("lastAuditorium") === null) {
    currentAuditorium = "ERR2";
  }
  else {
    currentAuditorium = localStorage.getItem("lastAuditorium");
  }

  if (localStorage.getItem("lastShowtime") === null) {
    currentShowtime = "ERR2";
  }
  else {
    currentShowtime = localStorage.getItem("lastShowtime");
  }

  // Load our content.
  $('.mainContent').html(`

<div class="container bg-dark text-white">

<div class="row no-gutters">
  <div class="col-12 col-sm-6 col-md-8">

    <div class="showingsCalender"> </div>
  <div id="datepicker" data-date="${currentShowDate}"></div>
  </div>
  <div class="col-6 col-md-4">
<a class="btn btn-large btn-success" id="processTicket" >Köp biljett</a>

<div class="biosalong"> </div>

</div>

<input type="text" id="movieOutput" name="debugField" placeholder="Debug field movie.">
<input type="text" id="bioSalongOutput" name="debugField" placeholder="Debug field biosalong.">
<input type="text" id="dateOutput" name="debugField" placeholder="Debug field date.">
<input type="text" id="timeOutput" name="debugField" placeholder="Debug field showTime.">
</div>
`);

  // Debug fält , tas bort innan vi lämnar in.
  $('#movieOutput').attr('placeholder', currentMovie);
  $('#bioSalongOutput').attr('placeholder', currentAuditorium);
  $('#timeOutput').attr('placeholder', currentShowtime);

  let shows = await (await fetch('/json/shows.json')).json();

  if (shows.length === 0) {
    alert.log('No shows ?.');
    return;
  }

  let sorted = [];

  bookTicket(0);

  // Film namn efter alla datum till sorted.
  for (let { film, date, auditorium } of shows) {
    if (film.indexOf(currentMovie) === 0) {
      let indexedDate = formatDate(date);
      sorted.push(indexedDate);
    }
  }

  let active_dates = sorted;

  // Populerar kalenderns för kundens översyn av vilka datum har 
  $('#datepicker').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true,
    todayHighlight: false,
    beforeShowDay: function (date) {
      var d = date;
      var curr_date = d.getDate();
      var curr_month = d.getMonth() + 1; //Months are zero based
      var curr_year = d.getFullYear();
      var formattedDate = curr_year + '-' + curr_month + '-' + curr_date;

      if ($.inArray(formattedDate, active_dates) != -1) {
        return {
          classes: 'activeClass',
        };
      }
      return;
    },
  });

  //Event : Visar bara vart man klickat sist.
  $('#datepicker').on('changeDate', function () {
    let clickedDate = formatDate($('#datepicker').data('datepicker').viewDate);

    localStorage.setItem('lastShowDate', clickedDate);
    $('#dateOutput').attr('placeholder', clickedDate);

    $('#bioSalongOutput').attr('placeholder', "None");
    $('#timeOutput').attr('placeholder', "None");

    //Clear och tagga fel nivå 3
    // Fel nivå3 betyder att biljetten inte är gilitig dvs datum / salong / tid 
    // matchar inte.
    currentShowDate = "Err3";
    currentAuditorium = "Err3";
    currentShowtime = "Err3";

    // Search or sorted array for just the date.
    for (let { film, date, auditorium, time } of shows) {

      if (film === currentMovie && formatDate(date) === clickedDate) {
        $('#dateOutput').attr('placeholder', "Movie has a showing on " + clickedDate);
        currentShowDate = clickedDate;
        localStorage.setItem('lastShowDate', clickedDate);

        localStorage.setItem('lastAuditorium', auditorium);
        currentAuditorium = auditorium;
        $('#bioSalongOutput').attr('placeholder', auditorium);

        localStorage.setItem('lastShowtime', time);
        currentShowtime = time;
        $('#timeOutput').attr('placeholder', time);
      }
    }
  });

  // Anton och Gustavs backend del.
  $('#processTicket').on('click', function (e) {
    let seats = [1, 2, 3, 4, 5, 10];
    processPayment(currentMovie, currentAuditorium, currentShowDate, currentShowtime, seats);
  })

}

// Fixed it to reflect JSON structure instead.
function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();


  return [year, month, day].join('-');
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
