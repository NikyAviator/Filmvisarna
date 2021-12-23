
//random number to the toilette password
function getRandomInt(min, max) {
  min = Math.ceil(1000);
  max = Math.floor(9999);
  return Math.floor(Math.random() * (max - min) + min);
}

async function showMyTickets() {


  let tickets = await (await fetch('/json/tickets.json')).json();

  if (shows.length === 0) {
    alert("Error tickets #1");
    return;
  }

  let isEmpty = true;

  for (var prop in tickets) {
    if (tickets.hasOwnProperty(prop)) {
      isEmpty = false;
    }
  }

  if (isEmpty) {

    $('.mainContent').html(`

    <div class="container-fluid bg-dark text-center text-white">
    <div class="row">
      <div class="col-md-3 mx-auto">
              <h1>Mina biljetter</h1>
              <p> Inga köpta biljetter </p>
      </div> 
     </div>
     `);

    return;
  }

  $('.mainContent').html(`

    <div class="container-fluid bg-dark text-center text-white">
    <div class="row">
      <div class="col-md-3 mx-auto">
              <h1>Mina biljetter</h1>
      </div> 
     </div>
     `);


  // Format buttons so they are equal to order they 
  // are created in.
  let buttonTitle = "cancelTicket_";
  let buttonIndex = 0;

  for (let ticket of tickets) {

    let buttonName = (buttonTitle + buttonIndex.toString());

    $('.mainContent').append(`
    <div class="row">
        <div class=" col-lg-8 col-md-10 col-sm-10 bg-dark mx-auto">
              
      
      <div id="biljetten" class="col-lg-8 col-md-10 col-sm-12 mb-3 mt-5 bg-danger text-center text-white text mx-auto">
              <img src="images/newMovieLogo.svg" alt="Movie Logo" width="45" height="45"
          class="d-inline-block align-text-top" />

    <a class="btn btn-large btn-success" id="${buttonName}">Avboka</a>

      <h2 class="text-dark">${ticket.movieName}</h2>
          <h3>Datum : ${ticket.showDate} </h3>
          <h3>Tid : ${ticket.showTime} </h3>
          <h3>Pris : ${ticket.ticketCost} Kr</h3>
          <h3>Platser : ${ticket.seats}</h3>
          <h3>Salong : ${ticket.auditorium} </h3>
          <p><small class="text-dark">Toalettkod : ${getRandomInt()}</small></p>
      </div >
     </div >
    </div>
    `);

    // Step index.
    buttonIndex += 1;
  }
  $('.mainContent').append(`</div >`)

  // create events
  for (let x = 0; x < buttonIndex + 1; x++) {
    $("#" + (buttonTitle + x)).on('click', function (event) {

      //alert("Button " + x);


      // clearOccupiedChairs(tickets[x].showId, tickets[x].seats);
      // deleteTicket(x)

      // Fix for waiting on async operations to finish /Tim
      $.when(clearOccupiedChairs(tickets[x].showId, tickets[x].seats) && deleteTicket(x)).done(function () { location.reload(); });

    });
  }
}

async function deleteTicket(ticketId) {

  let data = await (await fetch('/json/tickets.json')).json();

  // alert("DONK" + data[ticketId].movieName + " at index " + ticketId);

  let nArray = [...data];
  nArray.splice(ticketId, 1);
  // convert JSON object to string
  //const writeData = JSON.stringify(data);


  JSON._save('tickets', nArray);
}

async function clearOccupiedChairs(movieShowId, freeChairsNumbers) {
  let bookings = await (await fetch('/json/bookings.json')).json();

  //alert("Searching bookings for show id : " + movieShowId);


  let index = 0;
  // Search our bookings
  for (let { movieName, seats, showId } of bookings) {

    // Find tickets show id
    if (showId === movieShowId) {
      // alert(movieName + " contains booked chairs " + seats);


      var arr = [...seats];

      // freeChairsNumbers is stored as string - have to convert numbers.
      let busyChairs = freeChairsNumbers.split(',');

      var result = busyChairs.map(function (x) {
        return parseInt(x, 10);
      });

      // alert("BEFORE SLICE " + arr);
      // alert("freeChairsNumbers ->>" + freeChairsNumbers);

      // If we match up chair numbers delete chair in array.
      for (var i = 0; i < arr.length; i++) {

        for (var x = 0; x < result.length; x++) {

          if (arr[i] == result[x]) {
            arr.splice(i, 1);
          }
        }
      }

      //alert("AFTER SLICE : " + arr);
      bookings[index].seats = arr;

      JSON._save('bookings', bookings);
      return;
    }

    index += 1;
  }

  alert("Error could not find showId from ticket show id : " + movieShowId);
}