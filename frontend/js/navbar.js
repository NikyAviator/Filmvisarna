function drawNavbar() {
  let container = document.getElementById('navbar-header');
  container.innerHTML = `<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
      <a class="navbar-brand" href="#">Filmvisarna</a>
      <img src="images/newMovieLogo.svg" alt="Movie Logo" width="45" height="39"
        class="d-inline-block align-text-top" />

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav m-lg-auto">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#about">Om oss</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#filter">Filmer</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#show-my-tickets">Show my tickets</a>
            </li>
          </ul>
        </div>
      </div>
</nav>`;
}
drawNavbar();


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
aboutPage();

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
filterPage();

