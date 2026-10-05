const displayContainer = document.getElementById("display-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("btn")

async function getIpAddress(ipToSearch) {
    try {
        let url = `https://geo.ipify.org/api/v2/country,city?apiKey=at_EGev9zvf2u9sGy4Y2dUmZku9mKp0m`;

        if (ipToSearch) {
            url += `&ipAddress=${ipToSearch}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        displayIpAddress(data);
    } catch (error) {
        console.log("Failed to fetch data, try again", error);
    }
}

    searchBtn.addEventListener("click", () =>{
        const searchTerm = searchInput.value.trim();
        getIpAddress(searchTerm)
    return
})

    searchInput.addEventListener("keydown", (event) =>{
        if(event.key === "Enter") {
            const searchTerm = searchInput.value.trim();
            getIpAddress(searchTerm)
        }
    return
})



function displayIpAddress(hi) {

    displayContainer.innerHTML= "";
    const displayCard = document.createElement("div")
    displayCard.className = 
    "flex flex-col items-center gap-3 py-3 px-5 text-center md:flex-row md:text-left md:gap-16 md:pl-20 md:divide-x-[1px] divide-gray-200"

    displayCard.innerHTML = `
       <div class="md:px-8">
        <span class="text-[12px] text-myGray-400 font-light">IP ADDRESS</span>
        <h3 class="font-semibold">${hi.ip}</h3>
       </div> 

       <div class="md:px-8">
        <span class="text-[12px] text-myGray-400 font-light">LOCATION</span>
        <h3 class="font-semibold">${hi.location.region}</h3>
       </div>

       <div class="md:px-8">
        <span class="text-[12px] text-myGray-400 font-light">TIMEZONE</span>
        <h3 class="font-semibold">${hi.location.timezone}</h3>
       </div>

       <div>
        <span class="text-[12px] text-myGray-400 font-light">ISP</span>
        <h3 class="font-semibold">${hi.isp}</h3>
       </div>


    `
    displayContainer.appendChild(displayCard);

    const lat = hi.location.lat;
    const lng = hi.location.lng;

    map.setView([lat, lng], 13);

    if (marker === null) {
        marker = L.marker([lat, lng]).addTo(map);
    } else {
        marker.setLatLng([lat, lng]);
    }
}

var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);


var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

let marker = null;
getIpAddress("");