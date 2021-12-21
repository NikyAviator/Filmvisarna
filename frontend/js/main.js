// SPA hashEvent förändring. Istället för anchor fokusering på sidan
// så körs en function nedan beronded på nykelordet / hashen som
// skickats. reactOnHashChange() regarar automatiskt.
function reactOnHashChange() {

  // Ny plats eller gå till mainPage.
  let pageToDisplay = location.hash || 'mainPage';
  pageToDisplay = pageToDisplay.replace('#', '');

  // Frigör nykelorder från # tecknet så vi endast söker
  // efter ord som Film-1 , Film-2. 
  if (pageToDisplay.indexOf('film') === 0) {
    let filmId = +pageToDisplay.split('-')[1];

    // Här är det olika "states" som sidan kan bli beordrad att 
    // visa. 
    //
    // Pga av filmsidorna är skapade från json så indexeras dem
    // film-1,film-2 etc. Vart vi kommer fram till är ett slut id
    // t.ex 1 , 2 ,3 ...
    focusMovie(filmId);
    return;
  } else if (pageToDisplay.indexOf('booking') === 0) {
    bookingPage();
    return;
  } else if (pageToDisplay.indexOf('show-my-tickets') === 0) {
    showMyTickets();
    return;
  } else if (pageToDisplay.indexOf('about') === 0) {
    aboutPage();
    return;
  } else if (pageToDisplay.indexOf('filter') === 0) {
    filterPage();
    return;
  }

  window[pageToDisplay]();
}

async function processPayment(showId, seats) {
  //alert('processPayment ' + showId + ' seats ' + seats);

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
}

async function saveTicket(
  currentMovie,
  currentAuditorium,
  seats,
  currentShowtime,
  currentShowDate,
  currentShowId
) {
  let ticket = await JSON._load('tickets');
  let newTicket = {
    movieName: currentMovie,
    auditorium: currentAuditorium,
    showTime: currentShowtime,
    showDate: currentShowDate,
    seats: seats,
    ticketCost: totalTicketCost,
    showId: currentShowId
  };

  //alert(newTicket.movieName);
  ticket.push(newTicket);
  JSON._save('tickets', ticket);
}


// BookingPage är kundens köp översikts information - viktig information som filmens visnings datum i
// gröna datum samt dagens specifika visnings salong. 
let totalTicketCost;
async function bookingPage() {
  // Page presistance.
  // saves movies past refresh.
  let currentMovie = localStorage.getItem('lastMovie');
  let currentAuditorium = 'ERR';
  let currentShowDate = 'ERR';
  let currentShowtime = 'ERR';

  let showId = -1;
  let cinemaId = -1;

  //skall ändras till sessionStorage. 
  if (localStorage.getItem('lastShowDate') === null) {

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
  if (localStorage.getItem('lastShowId') === null) {
    currentShowtime = -1;
  } else {
    currentShowtime = localStorage.getItem('lastShowId');
  }

  // Producera innehåll för mainContent baserat på film data.
  $('.mainContent').html(`

<div class="container bg-dark text-white">

<div class="row justify-content-evenly">
  <div class="col-12 col-sm-4 col-md-4">

    <div class="showingsCalender"> </div>
  <div id="datepicker" data-date="${currentShowDate}"></div>
  </div>
  <div class="col-12 col-md-6 col-lg-4">


<div class="d-flex flex-column justify-content-center" id="biosalong">  
<h2> Välj datum </h2>
</div>

</div>

<label class="form-label1">Vuxna (0 till 5)</label>
<input type="range" id="RangeCalc1"  value="0"  name="rangeInput1" min="0" max="5" onchange="updateTextInput('Vuxen',this.value); updateTicketCost();">
<input type="personInput" id="Vuxen" value="0">

<label class="form-label2">Barn (0 till 5)</label>
<input type="range" id="RangeCalc2" value="0"  name="rangeInput2" min="0" max="5" onchange="updateTextInput('Barn',this.value);">
<input type="personInput" id="Barn" value="0">

<label class="form-label3">Senior (0 till 5)</label>
<input type="range" id="RangeCalc3" value="0"  name="rangeInput3" min="0" max="5" onchange="updateTextInput('Senior',this.value);">
<input type="personInput" id="Senior" value="0">

<input type="personInput" id="Price" value="Pris : 0">

<a class="btn btn-large btn-success" id="processTicket" >Köp biljett</a>
</div>
`);

  // Create a function that stores the slided values.

  let amountVuxen = 0;
  let amountBarn = 0;
  let amountSenior = 0;
  totalTicketCost = 0;



  function updateTicketCost() {
    totalTicketCost = (amountVuxen * 85) + (amountBarn * 65) + (amountSenior * 75);
  }

  $('#RangeCalc1, #RangeCalc2, #RangeCalc3').change(function () {

    amountVuxen = parseInt(document.getElementById('Vuxen').value, 10);
    amountBarn = parseInt(document.getElementById('Barn').value, 10);
    amountSenior = parseInt(document.getElementById('Senior').value, 10);

    updateTicketCost();

    //alert("Vuxen : " + amountVuxen + " Barn " + amountBarn + " Senior " + amountSenior);

    document.getElementById('Price').value = ("Pris :" + totalTicketCost.toString());
  });

  let shows = await (await fetch('/json/shows.json')).json();

  if (shows.length === 0) {
    //alert.log('No shows ?.');
    return;
  }

  let sorted = [];

  // Film namn efter alla datum till sorted.
  for (let { film, date, auditorium } of shows) {
    if (film.indexOf(currentMovie) === 0) {
      let indexedDate = formatDate(date);
      sorted.push(indexedDate);
    }
  }

  // Här skapas en array som skall fyllas på med relvanta
  // datum för kalendern. 
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

      if ($.inArray(formattedDate, sorted) != -1) {
        return {
          classes: 'activeClass',
        };
      }
      return;
    },
  });

  //Event : Visa sal och stols information baserat på datum
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

        if (currentAuditorium.indexOf('Stora Salongen') === 0) {
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
    selectedChairs = localStorage.getItem('selectedChairs');
    selectedChairs = bookTicket(cinemaId, showId);
  });

  $('#processTicket').on('click', function (e) {
    let seats = localStorage.getItem('selectedChairs');

    let myArray = seats.split(',');

    var result = myArray.map(function (x) {
      return parseInt(x, 10);
    });

    console.log(myArray);

    // Anton och Gustavs backend del. /Tim
    //processPayment(showId, result);
    // Lade till showId här med så att jag kan ta bort stolarna om ticket avbokas - behövs in skrivas ut i "my tickets" showId / Tim
    // saveTicket(currentMovie, currentAuditorium, seats, currentShowtime, currentShowDate, showId);

    // Fix for waiting on async operations to finish /Tim
    // Before this json changes would not happen if coupled with a refresh.
    $.when(processPayment(showId, result) && saveTicket(currentMovie, currentAuditorium, seats, currentShowtime, currentShowDate, showId)).done(function () { location.reload(); });

  });

}

function updateTextInput(target, val) {
  document.getElementById(target).value = val;
}

// Köpknappens logik
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
