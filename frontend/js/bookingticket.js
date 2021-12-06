async function bookTicket(id) {
  let shows = await (await fetch('/json/auditoriums.json')).json();
  let auditorium = shows[1];

  if (auditorium.length === 0) {
    return;
  }
  // Work in progress
  let bio = shows[0].seatsPerRow;

  let html = '';

  let rowLenght = 0;

  for (let h = 0; h < bio.length; h++) {
    html += '<div class="row">';
    rowLenght = bio[h];
    for (let x = 0; x < rowLenght; x++) {
      html += '<div class="seat"></div>';
    }
    html += '</div>';
  }

  console.log(html);

  $('.write').html(html);

  $('.mainContent').html(`
  <div class="container bg-dark text-white">

    <div class="row">
       
      <div class="col-3 me-auto">
       <div class="movie-container">
          <label>Pick Movie: </label>
          <select id="movie">
          <option> ${auditorium.film} </option>
          </select>
          <label>Pick a Showing: </label>
          <select id="movie">
          <option> ${auditorium.date} ${auditorium.time} </option>
          </select>
          <h6><br>${auditorium.auditorium}</h6>
        </div>
      </div>
      <div class="col-md-7 me-auto mt-md-2 ">
          <div class="screen"></div>
          
        
        <div class="text offset-md-1">
        <div class="seats">
        ${html}
        </div>
        </div>

      </div>
    
    </div>

  </div>
`);
}
bookTicket();

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
