const displayContainer = document.getElementById("display-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("btn");

let controller;

const isIp = (value) => /^[\d.]+$/.test(value) || value.includes(":");

async function getIpAddress(query) {
  controller?.abort();
  controller = new AbortController();

  const params = new URLSearchParams({
    apiKey: "at_q8ofnErLjY6YMkeF25DD73fnWeNfC",
  });

  if (query) {
    params.set(isIp(query) ? "ipAddress" : "domain", query);
  }

  try {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?${params}`,
      {
        signal: controller.signal,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.messages || "Unable to find that IP address or domain.",
      );
    }

    displayIpAddress(data);
  } catch (error) {
    if (error.name !== "AbortError") {
      showError(error.message);
    }
  }
}

searchBtn.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim();
  getIpAddress(searchTerm);
  return;
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const searchTerm = searchInput.value.trim();
    getIpAddress(searchTerm);
  }
  return;
});

function displayIpAddress(hi) {
  displayContainer.innerHTML = "";

  const displayCard = document.createElement("dl");

  displayCard.className =
    "flex flex-col items-center gap-3 py-3 px-5 text-center md:flex-row md:text-left md:gap-16 md:pl-20 md:divide-x-[1px] divide-gray-200";

  displayCard.innerHTML = `
       <div class="md:px-8">
        <dt class="text-[12px] text-myGray-400 font-light">IP ADDRESS</dt>
        <dd class="font-semibold">${hi.ip}</dd>
       </div>

       <div class="md:px-8">
        <dt class="text-[12px] text-myGray-400 font-light">LOCATION</dt>
        <dd class="font-semibold">${hi.location.region}</dd>
       </div>

       <div class="md:px-8">
        <dt class="text-[12px] text-myGray-400 font-light">TIMEZONE</dt>
        <dd class="font-semibold">${hi.location.timezone}</dd>
       </div>

       <div>
        <dt class="text-[12px] text-myGray-400 font-light">ISP</dt>
        <dd class="font-semibold">${hi.isp}</dd>
       </div>
    `;

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

function showError(message) {
  displayContainer.innerHTML = "";

  const errorMessage = document.createElement("p");

  errorMessage.className =
    "flex h-full items-center justify-center px-5 text-center text-sm font-medium text-red-500";

  errorMessage.textContent = message;

  displayContainer.appendChild(errorMessage);
}

var map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let marker = null;

getIpAddress("");
