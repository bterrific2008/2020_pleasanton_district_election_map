/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
let map;
let infoWindow;

function initMap() {

    map = L.map('map').setView([37.65012598689348, -121.8916079152317], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '? OpenStreetMap'
    }).addTo(map)

    infoWindow = L.marker([37.65012598689348, -121.8916079152317]).addTo(map);

    L.geoJson(
        districts,
        {
            style: function (feature) {
                switch (feature.properties.DISTRICT) {
                    case '1': return { color: "#ff0000" };
                    case '2': return { color: "#0000ff" };
                    default: return { color: "#ff1000" };
                }
            }
        }
    ).addTo(map);

    const locationButton = document.getElementById("update_location");

    locationButton.textContent = "Pan to Current Location";
    locationButton.classList.add("custom-map-control-button");
    locationButton.addEventListener("click", () => {
        locationButton.textContent = "Loading...";

        // try permissions API
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
                const permission = result.state;
                if (permission === 'granted' || permission === 'prompt') {
                    _onGetCurrentLocation();
                }
            });
        } else if (navigator.geolocation) {
            _onGetCurrentLocation();
        }
        else {
            // Browser doesn't support Geolocation
            _handleLocationError(false, infoWindow, map.getCenter());
        }
        locationButton.textContent = "Pan to Current Location";
    });
}

function _onGetCurrentLocation() {
    console.info("Retrieving Current Location")
    navigator.geolocation.getCurrentPosition(
        (position) => {
            var lat = (position.coords.latitude);
            var lng = (position.coords.longitude);
            var newLatLng = new L.LatLng(lat, lng);
            infoWindow.setLatLng(newLatLng);

            infoWindow.bindPopup("Location found.");
            infoWindow.openPopup();
            map.panTo(newLatLng);
        },
        () => {
            _handleLocationError(true, infoWindow, map.getCenter());
        }
    );

}

function _handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setLatLng(new L.LatLng(pos.lat, pos.lng));
    infoWindow.bindPopup(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.openPopup();
}

function initialize() {
    initMap();
}

window.initialize = initialize;
