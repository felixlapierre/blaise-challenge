import React, { useState } from 'react';
import './App.css';
import ReactMapGL, { Source, Layer, Marker } from 'react-map-gl';
import { createPassengerMarker, createBusStopMarker } from './images/marker';

var passengers = require("./passengers.json");
var stops = require("./stops.json");

const mapboxAccessToken = "pk.eyJ1IjoiZmVsaXhsYXBpZXJyZSIsImEiOiJjazY5aXJ3bGswZzdrM2ZtcmY1cGxxeDNpIn0.WYhzLFieiQHNbp4LKyGWyw";

function pythagoras(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function App() {
    const [viewPort, setViewport] = useState({
        width: 800,
        height: 600,
        latitude: 45.5129604703,
        longitude: -73.5729924601,
        zoom: 15
    })

    let person1 = [passengers[0].lat, passengers[0].lon];
    let person2 = [passengers[1].lat, passengers[1].lon];

    let data = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [person1, person2]
                }
            }
        ]
    }

    const dataLayer = {
        id: 'data',
        type: 'fill',
        paint: {
            'fill-color': "#00ffff",
            'fill-opacity': 1.0
        }
    }

    const markers = [];
    passengers.forEach(passenger => {
        //Find the nearest bus stop
        let minDistance = Number.MAX_VALUE;
        let closestStop = stops[0];
        stops.forEach((stop) => {
            const distance = pythagoras(passenger.lon, passenger.lat, stop.lon, stop.lat);
            if (distance < minDistance) {
                minDistance = distance;
                closestStop = stop;
            }
        })
        console.log(closestStop);

        markers.push(
            <Marker latitude={passenger.lat}
                longitude={passenger.lon}>{createPassengerMarker()}</Marker>)
    });
    stops.forEach(stop => {
        markers.push(
            <Marker latitude={stop.lat}
                longitude={stop.lon}>{createBusStopMarker()}</Marker>
        )
    })

    return (<ReactMapGL {...viewPort}
        onViewportChange={setViewport}
        mapboxApiAccessToken={mapboxAccessToken}
    >
        {markers}
        <Source type="geojson" data={data}>
            <Layer {...dataLayer} />
        </Source>
    </ReactMapGL>);
}

export default App;
