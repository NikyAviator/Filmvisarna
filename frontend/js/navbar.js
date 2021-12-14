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
              <a class="nav-link" href="#">About</a>
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
