const apiKey  = 'ZHEo4cTOoW9z72rOGDGIuipRn0OUrCuB';
const baseURL = 'http://dataservice.accuweather.com/';

const content = document.getElementById('main-content');


document.getElementById('btn-search').addEventListener('click', function() {

    let getQuery = document.getElementsByName("query")[0].value;
    getDataQuery( getQuery )
    

});




// get list of query
function getDataQuery( query ) {

    let request = baseURL + 'locations/v1/search?apikey=' + apiKey + '&q=' + query + '&language=id';
    fetch( request )
        .then( response => response.json() )
        .then( data => {
            
            let items = "";
            console.log( data );
            
            data.forEach( row => {


                items += `
                    <div class="col-md-12 mb-4" id="item-list" >
                        <div class="card hover-shadow" >
                        <div class="card-body" >
                            <h5 class="dark-grey-text my-4" >
                            ${row.LocalizedName}, ${row.AdministrativeArea.LocalizedName}, ${row.Country.LocalizedName}</h5>
                            <b >Dengan ID : ${row.Key}</b>
                            <a href="javascript:void(0)" >
                            <div class="mask" data-key="${row.Key}"></div>
                            </a>
                        </div>
                        </div>
                    </div>
                `;
            } );


            let listElement = `
                <section>
                    <h2>Daftar Lokasi yang tersedia</h2>    
                    <h3>Pencarian : <b>"${query}"</b></h3>
                    <div class="row text-start">${items}</div>
                </section>`;
            content.innerHTML = listElement;


            // click detail
            const detail = document.querySelectorAll('#item-list');
            detail.forEach( item => {

                item.onclick = ( event => {

                    let key = event.target.dataset.key;
                    getDataDetailItem( key );
                } )
            } )
        } )
        .catch( err => {

            console.log( err );
        } )
}






// get data detail
function getDataDetailItem( key ) {

    let request = baseURL + 'forecasts/v1/daily/1day/'+ key +'?apikey='+ apiKey +'&language=id';
    fetch( request )
        .then( response => response.json() )
        .then( data => {


            let requestDetail = baseURL + 'locations/v1/'+ key +'?apikey=' + apiKey + '&language=id';
            fetch( requestDetail )
                .then( responseDet => responseDet.json() )
                .then( dataDet => {


                    // F to C 
                    let farenToC = parseInt(((data.DailyForecasts[0].Temperature.Maximum.Value) - 32) * 5/9);

                    let elementHTML = `

                        <div class="row">
                        <div class="col-lg-7 align-self-center text-center text-lg-start">
                        <h3 class="mb-3">Ramalan Cuaca Hari ini </h3>
                        <p>${dataDet.LocalizedName}, ${dataDet.AdministrativeArea.LocalizedName}, ${dataDet.Country.LocalizedName}</p>
                        <div class="row">
                            <div class="col-md-4">
                                    <h1 style="font-size: 72px">${farenToC}°</h1>
                                    Reel Feel
                            </div>
                            <div class="col-md-8">
                                <div style="margin-top: 30px;">
                                    <h2>${data.DailyForecasts[0].Day.IconPhrase}</h2>
                                </div>
                            </div>
                        </div>
                        <div class="mt-2">
                            CUACA MENDATANG <br>
                            <b>${data.Headline.Text}</b>
                        </div>
                        </div>
                        <div class="col-lg-5 mb-4 mb-lg-0">
                        <img
                            src="https://mdbootstrap.com/img/illustrations/app-user-colour.svg"
                            class="img-fluid mx-auto"
                            alt="Sample image"
                        />
                        </div>
                    </div>`;

                    content.innerHTML = elementHTML;
                } )
        } ) ;




    

}