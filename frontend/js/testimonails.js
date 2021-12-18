function drawTestimonials() {
  let container = document.getElementById('testimonials');
  container.innerHTML = `
  <div
    id="carouselExampleControls"
    class="carousel slide"
    data-bs-ride="carousel"
    data-bs-interval="false"
  >
    <div class="carousel-inner">
      <div class="carousel-item active bg-dark">
        <h2>
          "Underbar service och fräscha salonger. Rekomenderas starkt!"
        </h2>
        <img
          id="anton-pic"
          src="images/anton-pic.jpg"
          width="150px"
          height="150px"
          alt="anton-pic"
        />
        <em>Anton, Skåne</em>
      </div>
      <div class="carousel-item" style="background-color: #8E806A">
        <h2>"Underbar atmosfär! Dom säljer också öl!"</h2>
        <img
          id="niky-pic"
          src="images/Niky-modified.png"
          width="150px"
          height="150px"
          alt="niky-profile"
        />
        <em>Niky, Skåne</em>
      </div>
      <div class="carousel-item" style="background-color: #C3B091">
        <h2>"Grym personal, bra ljud och sköna stolar!"</h2>
        <img
          id="sara-pic"
          src="images/sara-pic.jpg"
          width="150px"
          height="150px"
          alt="sara-profile"
        />
        <em>Sara, Malmö</em>
      </div>
      <div class="carousel-item" style="background-color: #8E806A">
        <h2>"Atmosfären är elektrifierande!"</h2>
        <img
          id="gustav-pic"
          src="images/gustav-pic.jpg"
          width="150px"
          height="150px"
          alt="gustav-profile"
        />
        <em>Gustav, Malmö</em>
      </div>
      <div class="carousel-item" style="background-color: #C3B091">
        <h2>"Jag är en legend, även detta stället är legendariskt!"</h2>
        <img
          id="tim-pic"
          src="images/tim.webp"
          width="150px"
          height="150px"
          alt="tim-profile"
        />
        <em>Tim, Lund</em>
      </div>
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExampleControls"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#carouselExampleControls"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>`;
}
drawTestimonials();
