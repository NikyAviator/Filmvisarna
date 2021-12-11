// Klickar man på en film poster så körs den här methoden.
async function focusMovie(id) {
  let result = await (await fetch('/json/movies.json')).json();

  if (result.length === 0) {
    alert.log('An error occurred trying to load movies data.');
    return;
  }

  // Här kan man ändra "sidan" när man klickat på en poster och innehållet visas.
  let film = result[id - 1];

  // Spara sista klickade filmen för booking ref till att
  // söka efter visningar på booking.
  //https://stackoverflow.com/questions/16206322/how-to-get-js-variable-to-retain-value-after-page-refresh
  localStorage.setItem('lastMovie', film.title);

  $('.mainContent').html(`
  
      <div class="container bg-dark text-white">
      <div class="row">
        <div class="col-3 me-auto">
          <img src="/images/Poster-${film.id
    }.jpg" class="img-fluid d-none d-sm-block">
        </div>
        <div class="col-md-7 col-xs-12 me-auto">
          <div class="ratio ratio-16x9">
            <iframe src="https://www.youtube.com/embed/${film.youtubeTrailers
    }" title="YouTube video"
              allowfullscreen></iframe>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 me-md-auto mt-2">
            <a href="#booking" class="btn btn-danger btn-lg mt-2" role="button" aria-pressed="true">See shows</a>
          </div>
          <div class="col-md-7 me-auto mt-md-2">
            <div class="movieinfo mt-5">
              <h1>${film.title}</h1>
              <p>${film.genre.join(', ')} | ${formatTime(film.length)} | Språk: ${film.language
    } | Text: ${film.subtitles}</p>
              <div class="description">
                <p>${film.description}</p>
              </div>
              <p>Regi: ${film.director}</p>
              <p>Skådespelare: ${film.actors.join(', ')}</p>
              <p>Distributör: ${film.distributor}</p>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          ${displayReviews(film.reviews)}
        </div>
      </div>
      `);
}
function formatTime(minutes) {
  let timeString = '';
  let restMinutes = minutes % 60;
  let hours = (minutes - restMinutes) / 60;
  timeString =
    (hours > 0 ? hours + ' tim ' : '') +
    (restMinutes > 0 ? restMinutes + ' min' : '');
  return timeString;
}

function displayReviews(review) {
  let html = '';
  for (let i = 0; i < review.length; i++) {
    html += `<div class="col-md-4"> <div class="d-flex justify-content-center">`;
    for (let stars = 0; stars < review[i].max; stars++) {
      if (stars <= review[i].stars - 1) {
        html += `<img src="/images/icon-star-light.png" class="star">`;
      } else {
        html += `<img src="/images/icon-star-grey.png" class="star">`;
      }
    }
    html += `</div> <br> <p class="text-center">"${review[i].quote}"</p> 
                <p class="text-end">- ${review[i].source}</p> </div>`;
  }
  return html;
}
