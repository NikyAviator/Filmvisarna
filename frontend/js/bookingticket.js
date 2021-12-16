
// Om det finns bookade platser så finns det också ett booking id.
async function bookTicket(cinemaId, bookingId) {

  let shows = await (await fetch('/json/auditoriums.json')).json();
  let bookings = await (await fetch('/json/bookings.json')).json();


  if (cinemaId == -1) {
    alert("Error, picked date with no showing ? ")
    return;
  }

  if (shows.length === 0) {
    return;
  }

  let auditorium = shows[cinemaId];
  if (!auditorium) { return 'Invalid auditorium in show data!'; }

  let bio = auditorium.seatsPerRow;
  let busyChairs;

  let selected = [];

  for (let { showId, seats } of bookings) {
    if (showId === bookingId) {

      busyChairs = seats;

      break;
    }
  }

  if (busyChairs != null)
    alert("Occupied chairs found." + busyChairs);

  let html = '';
  let rowLenght = 0;
  let stolnummer = 0;

  // Runs a loop for each row in the auditorium, adds a div for each row
  for (let h = 0; h < bio.length; h++) {

    html += `<div class="movierow" >`;
    rowLenght = bio[h];
    // A nested loop creates all the seats for one row
    for (let x = 0; x < rowLenght; x++) {

      if (busyChairs != null) {

        let canDraw = true;

        for (let count = 0; count < busyChairs.length; count++) {

          if (stolnummer === busyChairs[count]) {
            canDraw = false;
            break;
          }
        }

        if (canDraw) {
          html += `<div class="seat" id="row${h}_seat${x}" ></div>`;
        }
        else {
          html += `<div class="seatOccupied" id="row${h}_seat${x}" ></div>`;
        }
      }
      else {
        html += `<div class="seat" id="row${h}_seat${x}"></div>`;
      }

      stolnummer = stolnummer + 1;
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
    alert(event.target.id);

    let text = event.target.id;

    const myString = text;
    const splits = myString.split('_', 2)

    splits[0] = splits[0].replace(/\D/g, '');
    splits[1] = splits[1].replace(/\D/g, '');

    alert("value 1# -> " + splits[0] + " value#2 -> " + splits[1]);

    let addNew = true;

    // tror bio object inte blivit uppdatera när detta körs
    alert("Pre chairNumber() -> X : " + parseInt(splits[1]) + " Y : " + parseInt(splits[0]) + " trying to convert to seatnumber");
    let val = chairNumber(parseInt(splits[1]), parseInt(splits[0]), auditorium);
    // alert("VALUE IS " + val);

    for (exist = 0; exist < selected.length; exist++) {
      if (val == selected[exist]) {

        const index = selected.indexOf(val);
        if (index > -1) {
          selected.splice(index, 1);
        }
        alert("EXIST" + val);
        addNew = false;
      }
    }

    if (addNew) {
      selected.push(val);
      localStorage.setItem("selectedChairs", selected);
    }

    // alert("bookingticket.js -> " + selected);

  });

  //alert("BookingTicket selected " + selected);
}

//Här nedan är det Thomas Kod vi fick i samband med uppgiften
//Har bara flyttat den från "book.js" som jag sedan tog bort :D

function chairNumber(row, height, layout) {

  let stolnummer = 0;

  //alert("Calc for layout " + layout.seatsPerRow);

  // Ritar 
  for (let y = 0; y < layout.seatsPerRow.length; y++) {
    let rowLenght = layout.seatsPerRow[y];

    for (let x = 0; x < rowLenght; x++) {

      if (y == (height) && x == row) {

        alert("Post chairNumber() -> " + stolnummer + " stolnummer");
        return stolnummer;
      }

      stolnummer += 1;
    }
  }

  alert("This should never trigger - chairnumber " + stolnummer);
}