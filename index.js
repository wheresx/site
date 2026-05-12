
const map = L.map('map').setView([0, 0], 5);

const mapTokens = [
    "bVkG5E0PiokoP5WZRP9zpus9Bac8j9sT0HnaXdGFF8xT0fY4ggBi7TgTV1660qXV",
    "GONv9dFvCU616XgdkgIHBClBblHTuCm9004cJSwc2gsp2AEkTACEm7mIYKtPKq2H",
    "l24afZxkZQRuUAv4lcP6YHbkjTs0OFa0JWOOJNmwccbMDQ0vsUGB3td3H5Ufm17s",
    "kILBKCmtFFrLRPi89NAKi0YgTCraZyPAfOHncLCV1Rp7Tc3Aw5XvnLLxKOgw8emx",
    "uwAOtOoSgNuhWz3IfKg20baIrPSzzU9BuZE0cwZFsWQiAAUVpadkBQLuRsKiCh5u",
]

const mapTokenIdx = Math.floor(Math.random() * mapTokens.length);
console.log('Using map token index: ', mapTokenIdx);
const mapToken = mapTokens[mapTokenIdx];
const layer = L.tileLayer('https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	accessToken: mapToken
});

// const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// });

layer.addTo(map);

const currentDate = new Date();
const locationElem = document.getElementById('location');
const tableElem = document.getElementById('table');
const upnextElem = document.getElementById('upnext');

function inputDate(date) {
    return date.toISOString().split('T')[0]
}

function displayError() {
    console.error('No location data found. Data: ', data);
    locationElem.textContent = 'No location data found';
    // Clear the map
    map.setView([0, 0], 9);
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    return;
}

let currentCoords = null;
async function setMapLocation(coords) {
    // If no coords set, this is a first time call. Zoom in.
    if (currentCoords === null) {
        // Zoom from 0 -> 9
        map.setView(coords, 0);
    }

    if (currentCoords !== coords) {
        currentCoords = coords;
        // Clear the markers
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
        L.marker(coords).addTo(map);
    }

    map.flyTo(coords, 9, {
        animate: true,
        duration: 4.0
    });
}

async function updateDisplay() {
    if (!data) return;

    try {
        let locText = data["current"]["display"];
        let locCoords = data["current"]["coords"];

        // Replace all content of locationElem with link
        locationElem.textContent = locText;
        locationElem.onclick = function() {
            setMapLocation(locCoords);
        }
        // Set cursor to pointer
        locationElem.style.cursor = 'pointer';

        setMapLocation(locCoords);

        let hasData = false;
        for (row of data["table"]) {
            let newRow = tableElem.insertRow();

            // Make the display a URL with underline (but default color)
            let coords = row["coords"];

            let cell = newRow.insertCell();
            cell.style.textDecoration = 'underline';
            cell.style.textDecorationColor = '#aaaaaa';

            cell.textContent = row["display"];
            cell.onclick = function() {
                setMapLocation(coords);
            }
            cell.style.cursor = 'pointer';

            newRow.insertCell().textContent = row["notes"];
            hasData = true;
        }
        if (hasData) {
            upnextElem.style.display = 'block';
        }

    } catch (e) {
        console.error(e);
        displayError();
    }
}

updateDisplay();
