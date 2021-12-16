function aboutPage() {
  $('.mainContent').html(`
    
      <div class="container bg-dark text-white">
        <div class="row mt-4">
          <img src="images/biosnacks.jpeg" alt="Biosnacks" class="img-fluid">
        </div>
        <div class="row mt-4">
          <p>Välkommen till Filmvisarna! Vi är en liten biografkedja med två mysika biografsalonger i Småstad. Vi har rättighet att visa ett antal olika filmer. Se utbud på startsidan. </p>
        </div>
        <div class="row mt-4">
        <h5>BUTIK</h5>
          <p>Film utan tilltugg går inte. I vår biografsbutik har vi sortiment med popcorn, läsk och flera godsaker för alla smaker! </p>
        </div>
        <div class="row mt-4">
          <h5>PRISER</h5>
          <p> - Barn: 65kr <br> - Normal: 85kr <br> - Pensionär: 75kr</p>
        </div>
        <div class="row mt-4">
          <h5>CONTACT</h5>
          <p>Vid frågor mejla oss på: someone@filmvisarna.com</p>
        </div>
      </div>
    `);
}

async function filterPage() {
  let filter = await (await fetch('./json/movies.json')).json();
  $('.mainContent').html(`
    
      <div class="container bg-dark text-white">
        <div class="row mt-4">
          <h2>Sara ${filter.id}</h2>
        </div>
      </div>
        `);
}
