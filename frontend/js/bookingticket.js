async function bookTicket(id) {
  let shows = await (await fetch('/json/auditoriums.json')).json();
  let auditorium = shows [0, 1];
  
  if (auditorium.length === 0) {
    return;
  }
  
  $('.mainContent').html(`
    <div class="container bg-dark text-white">
      <div class="row">
       <div class="col-3 me-auto">
       <div class="movie-container">
        <label>Pick Movie</label>
        <select id="movie">
        <option> ${auditorium.name} </option>
        </select>
        </div>
      </div>
    </div>
      <div class="col-md-7 col-xs-12 me-auto">
        <div class="ratio ratio-16x9">
          
        </div>
      </div>
    </div>
    `);
}
bookTicket();