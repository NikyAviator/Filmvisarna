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
          "Wonderful service and very clean auditorioums, would recommend!"
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
      <div class="carousel-item" style="background-color: #3e065f">
        <h2>"Wonderful atmospehere and they also sell beer!"</h2>
        <img
          id="niky-pic"
          src="images/Niky-modified.png"
          width="150px"
          height="150px"
          alt="niky-profile"
        />
        <em>Niky, Skåne</em>
      </div>
      <div class="carousel-item" style="background-color: #700b97">
        <h2>"Amazing staff, good sound and comfy chairs!"</h2>
        <img
          id="sara-pic"
          src="images/sara-pic.jpg"
          width="150px"
          height="150px"
          alt="sara-profile"
        />
        <em>Sara, Malmö</em>
      </div>
      <div class="carousel-item" style="background-color: #8e05c2">
        <h2>"The atmosphere is electrifying!"</h2>
        <img
          id="gustav-pic"
          src="images/gustav-pic.jpg"
          width="150px"
          height="150px"
          alt="gustav-profile"
        />
        <em>Gustav, Malmö</em>
      </div>
      <div class="carousel-item" style="background-color: #3e065f">
        <h2>"Test one two!"</h2>
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