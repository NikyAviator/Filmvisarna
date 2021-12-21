function filterPage() {
  $('.mainContent').html(`
  
    <div class="container bg-dark text-white">
      <div class="row mt-4">
      <input type="search" id="form1" class="form-control" placeholder="Sök på film/datum/ålder"
      aria-label="Search" /> 
      </div>
      <div class="row mt-4">
      
        <table class="table table-striped">
          <tr class ="bg-secondary">
            <th>Film</th>
            <th>Datum</th>
            <th>Åldersgräns</th>
          </tr>
          <tbody id="myTable"></tbody>
        </table>
      </div>
    </div>
      `);
  
    buildTable();
  //Function för att "input" ska läsa inmatning
  $('#form1').on('keyup', function () {
    let value = $(this).val();
    buildTable(value);
  });

}


//Funktion för att hämta data från JSON och omvandla till tabellrader
let shows;

async function buildTable(filterValue = '') {
  // Only read shows from json if not already in memory
  shows = shows || await (await fetch('./json/shows.json')).json();
 
  // filter the shows according to filterValue
  let filteredShows = shows.filter(function (show) {
    return show.film.toLowerCase().includes(filterValue.toLowerCase()) ||
      show.date.includes(filterValue) || show.agegroup.includes(filterValue);
  });
  console.log(shows.length, filteredShows.length)
 
  let table = document.getElementById('myTable');
  let rows = '';
  for (let i = 0; i < filteredShows.length; i++) {
    rows += `<tr class="bg-white">
      <td>${filteredShows[i].film}</td>
      <td>${filteredShows[i].date}</td>
      <td>${filteredShows[i].agegroup}</td>
    </tr>`
  }
  table.innerHTML = rows;
}
buildTable(shows);


