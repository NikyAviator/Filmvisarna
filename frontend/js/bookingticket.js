
// Om det finns bookade platser så finns det också ett booking id.
async function bookTicket(cinemaId, bookingId) {

  let shows = await (await fetch('/json/auditoriums.json')).json();
  let bookings = await (await fetch('/json/bookings.json')).json();


  if (shows.length === 0) {
    return;
  }

  let salong = shows[cinemaId];
  let bio = salong.seatsPerRow;

  let busyChairs;

  let selected = [];

  for (let { showId, seats } of bookings) {
    if (showId === bookingId) {

      busyChairs = seats;
      //alert("Occupied chairs found." + busyChairs);
      break;
    }
  }

  let html = '';
  let rowLenght = 0;
  let stolnummer = 0;

  // Runs a loop for each row in the auditorium, adds a div for each row
  for (let h = 0; h < bio.length; h++) {
    html += `<div class="movierow" >`;
    rowLenght = bio[h];

    // A nested loop creates all the seats for one row
    for (let x = 0; x < rowLenght; x++) {

      stolnummer += 1;

      if (busyChairs != null) {

        let canDraw = true;

        for (let count = 0; count < busyChairs.length; count++) {

          if (busyChairs[count] == stolnummer) {

            canDraw = false;
          }
        }

        if (canDraw) {
          html += `<div class="seat" id="row${h}_seat${x}"></div>`;
        }
        else {

          html += `<div class="seatOccupied" id="row${h}_seat${x}"></div>`;
        }
      }
      else {
        html += `<div class="seat" id="row${h}_seat${x}"></div>`;
      }
    }

    html += '</div>';
  }
  $('#biosalong').html(`
        <div class="screen"></div>
        ${html}
`);
  // Event listener to get row and seat number when we click a seat
  // We can now select seats and deselect them
  $('.seat').click(function (event) {
    if ($(this).attr('class') == 'seat') {
      $(this).addClass('seatSelected');
    } else {
      $(this).removeClass('seatSelected');
    }
  });

  // Event listener to get row and seat number when we click a seat
  // https://stackoverflow.com/questions/48239/getting-the-id-of-the-element-that-fired-an-event/48684#48684
  $('.seat').click(function (event) {
    // alert(event.target.id);

    let text = $(event.target)[0].id;
    let x = parseInt(text.charAt(9)) + 1;
    let y = parseInt(text.charAt(3)) + 1;

    // alert("X " + x + " Y " + y);

    let val = chairNumber(x, y, bio);
    // alert("VAL" + val);

    let addNew = true;

    for (exist = 0; exist < selected.length; exist++) {
      if (val == selected[exist]) {
        const index = selected.indexOf(val);
        if (index > -1) {
          selected.splice(index, 1);
        }
        //alert("EXIST" + val);
        addNew = false;
      }
    }

    if (addNew)
      selected.push(val);

    /*
        const index = selected.indexOf(val);
        if (index > -1) {
          selected.splice(index, 1);
        }
    */
    // det anton och gustav skall fylla på.
    // alert("Selected chairs " + selected);
  });

  //alert("BookingTicket selected " + selected);
  alert("bookingTicket chairs " + selected);
}

//Här nedan är det Thomas Kod vi fick i samband med uppgiften
//Har bara flyttat den från "book.js" som jag sedan tog bort :D

// Make a booking
// showId = id of the show to book
// seats should be an array of set numbers
async function book(showId, seats) {
  let availableSeats = freeSeats(showId);

  // We have got an error from freeSeats, just return it
  if (typeof availableSeats === 'string') {
    return availableSeats;
  }

  // Flatten available seats to ONE array (instead of having separate rows)
  availableSeats = availableSeats.flat();

  // Check that all the seats we want to book are available
  for (let seat of seats) {
    if (!availableSeats.includes(seat)) {
      return 'Could not perform booking. Seat ' + seat + ' not available';
    }
  }

  // Create a new booking
  let booking = {
    id: data.bookings.length + 1,
    showId,
    seats,
  };

  // Add the booking to the existing bookings
  data.bookings.push(booking);

  // Save the booking to the bookings.json file
  await JSON._save('bookings', data.bookings);

  // Return the booking
  return booking;
}

// Find all free seats for a show
function freeSeats(showId) {
  // Find the show
  let show = findById('shows', showId);
  if (!show) {
    return 'Show does not exist!';
  }

  // Find the auditorium
  let auditorium = data.auditoriums.find((x) => (x.name = show.auditorium));
  if (!auditorium) {
    return 'Invalid auditorium in show data!';
  }

  // Loop through all bookings to get occupied seats
  let occupiedSeats = [];
  for (let booking of data.bookings) {
    // If it is not the same show then do nothing
    if (booking.showId != showId) {
      continue;
    }
    // Add the seats as occupied
    occupiedSeats.push(...booking.seats);
  }

  // Build an array with all seats in the auditorium
  let seats = [],
    seatNumber = 1;
  for (seatsInARow of auditorium.seatsPerRow) {
    let row = [];
    seats.push(row);
    for (let i = 0; i < seatsInARow; i++) {
      row.push(occupiedSeats.includes(seatNumber) ? 'x' : seatNumber);
      seatNumber++;
    }
  }

  return seats;
}


function chairNumber(row, height, layout) {

  // alert 
  // alert("SDAOKASDOAFJOF" + layout);
  let stolnummer = 0;

  // Ritar 
  for (let h = 0; h < layout.length; h++) {
    for (let x = 0; x < row; x++) {
      stolnummer += 1;

      if (h == (height - 1) && x == (row - 1)) {
        alert(stolnummer);
        return stolnummer;
      }
    }
  }
}