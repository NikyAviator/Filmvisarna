
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
  } else if (pageToDisplay.indexOf('about') === 0) {
    aboutPage();
    return;
  } else if (pageToDisplay.indexOf('filter') === 0) {
    filterPage();
    return;
  }

  // ANNARS
  window[pageToDisplay]();
}


// Verkar inte som JSON._save tycker om att man ger dem rena tal / inte strings
// https://www.w3schools.com/jsref/jsref_tostring_number.asp blir innuit i json
// Verkar endast gå att skapa ett nytt object men inte fylla på stolar.
// Tim

async function processPayment(showId, seats) {

  alert("processPayment " + showId + " seats " + seats);

  let data = await (await fetch('json/bookings.json')).json();

  let booking = data.find((booking) => booking.showId === showId);

  // console.log(booking);

  if (booking) {

    for (let seat of seats) {
      booking.seats.push(seat);
    }
  } else {
    data.push({ showId: showId, seats: seats });
  }

  await JSON._save('bookings', data);

  //alert(showId, seats);
  // Ladda -> Anton
  // GUstav -> Bookings
}

async function saveTicket(
  currentMovie,
  currentAuditorium,
  seats,
  currentShowtime,
  currentShowDate
) {
  let ticket = await JSON._load('tickets');
  let newTicket = {
    movieName: currentMovie,
    auditorium: currentAuditorium,
    showTime: currentShowtime,
    showDate: currentShowDate,
    seats: seats,
  };
  alert(newTicket.movieName);
  ticket.push(newTicket);
  await JSON._save('tickets', newTicket);
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

  let showId = -1;
  let cinemaId = -1;


  if (localStorage.getItem('lastShowDate') === null) {
    //alert("Error lastShowDate not found in local storage.")
    // Should be set todays date - if we havent visited the site
    // before.
    currentShowDate = '2021-12-1'; // mock date.
  } else {
    // It exist - good
    currentShowDate = localStorage.getItem('lastShowDate');
  }
  if (localStorage.getItem('lastAuditorium') === null) {
    currentAuditorium = 'ERR2';
  } else {
    currentAuditorium = localStorage.getItem('lastAuditorium');
  }
  if (localStorage.getItem('lastShowtime') === null) {
    currentShowtime = 'ERR2';
  } else {
    currentShowtime = localStorage.getItem('lastShowtime');
  }
  if (localStorage.getItem("lastShowId") === null) {
    currentShowtime = -1;
  } else {
    currentShowtime = localStorage.getItem('lastShowId');
  }

  // Load our content.
  $('.mainContent').html(`

<div class="container bg-dark text-white">

<div class="row justify-content-evenly">
  <div class="col-12 col-sm-4 col-md-4">

    <div class="showingsCalender"> </div>
  <div id="datepicker" data-date="${currentShowDate}"></div>
  </div>
  <div class="col-12 col-md-6 col-lg-4">


<div class="d-flex flex-column justify-content-center" id="biosalong"> </div>

</div>
<label for="customRange2" class="form-label">Vuxen</label>
<input type="range" class="form-range" min="0" max="5" id="customRange2">
<label for="customRange2" class="form-label">Barn</label>
<input type="range" class="form-range" min="0" max="5" id="customRange2">
<label for="customRange2" class="form-label">Senior</label>
<input type="range" class="form-range" min="0" max="5" id="customRange2">
<a class="btn btn-large btn-success" id="processTicket" >Köp biljett</a>
</div>
`);

  // Debug fält , tas bort innan vi lämnar in.
  $('#movieOutput').attr('placeholder', currentMovie);
  $('#bioSalongOutput').attr('placeholder', currentAuditorium);
  $('#timeOutput').attr('placeholder', currentShowtime);

  let shows = await (await fetch('/json/shows.json')).json();

  if (shows.length === 0) {
    //alert.log('No shows ?.');
    return;
  }

  let sorted = [];

  //bookTicket(cinemaId);

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

    $('#bioSalongOutput').attr('placeholder', 'None');
    $('#timeOutput').attr('placeholder', 'None');

    //Clear och tagga fel nivå 3
    // Fel nivå3 betyder att biljetten inte är gilitig dvs datum / salong / tid
    // matchar inte.
    currentShowDate = 'Err3';
    currentAuditorium = 'Err3';
    currentShowtime = 'Err3';

    cinemaId = -1;
    showId = -1;

    // Search or sorted array for just the date.
    for (let { id, film, date, auditorium, time } of shows) {
      if (film === currentMovie && formatDate(date) === clickedDate) {
        showId = id;
        localStorage.setItem('lastShowId', showId);

        $('#dateOutput').attr(
          'placeholder',
          'Movie has a showing on ' + clickedDate
        );
        currentShowDate = clickedDate;
        localStorage.setItem('lastShowDate', clickedDate);

        localStorage.setItem('lastAuditorium', auditorium);
        currentAuditorium = auditorium;
        $('#bioSalongOutput').attr('placeholder', auditorium);

        if (currentAuditorium.indexOf("Stora Salongen") === 0) {
          cinemaId = 0;
        } else {
          cinemaId = 1;
        }

        localStorage.setItem('lastShowtime', time);
        currentShowtime = time;
        $('#timeOutput').attr('placeholder', time);
      }
    }

    selectedChairs = [];
    selectedChairs = localStorage.getItem("selectedChairs");
    selectedChairs = bookTicket(cinemaId, showId);
  });

  // Anton och Gustavs backend del.
  $('#processTicket').on('click', function (e) {
    let seats = localStorage.getItem("selectedChairs");

    let myArray = seats.split(",");

    var result = myArray.map(function (x) {
      return parseInt(x, 10);
    });


    console.log(myArray);
    // alert("ProcessTicket  - > " + result);

    processPayment(showId, result);
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

// Thomas event lyssnare från lektionen.
window.onhashchange = reactOnHashChange;
reactOnHashChange();
