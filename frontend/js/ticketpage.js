//random number to the toilette password
function getRandomInt(min, max) {
  min = Math.ceil(1000);
  max = Math.floor(9999);
  return Math.floor(Math.random() * (max - min) + min);
}

async function showMyTickets() {
  let tickets = await (await fetch('/json/tickets.json')).json();

  $('.mainContent').html(`

    <div class="container-fluid bg-dark text-center text-white">
    <div class="row">
      <div class="col-md-3 mx-auto">
              <h1>Mina biljetter</h1>
      </div> 
     </div>
     `);



  for (let ticket of tickets) {
    $('.mainContent').append(`
    <div class="row">
        <div class=" col-lg-8 col-md-10 col-sm-10 bg-dark mx-auto">
              
      
      <div id="biljetten" class="col-lg-8 col-md-10 col-sm-12 mb-3 mt-5 bg-danger text-center text-white text mx-auto">
              <img src="images/newMovieLogo.svg" alt="Movie Logo" width="45" height="45"
          class="d-inline-block align-text-top" />
      <h2 class="text-dark">${ticket.movieName}</h2>
          <h3>Datum : ${ticket.showDate} </h3>
          <h3>Tid : ${ticket.showTime} </h3>
          <h3>Pris : ${ticket.ticketCost}</h3>
          <h3>Platser : ${ticket.seats}</h3>
          <h3>Salong : ${ticket.auditorium} </h3>
          <p><small class="text-dark">Toalettkod : ${getRandomInt()}</small></p>
      </div >
     </div >
    </div>
    `);
  }
  $('.mainContent').append(`</div >`)
}
