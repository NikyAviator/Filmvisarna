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
