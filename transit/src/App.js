import React, { useState } from 'react';
import './App.css';
import ReactMapGL, { Source, Layer, Marker } from 'react-map-gl';
import { createPassengerMarker, createBusStopMarker } from './images/marker';
import Polyline from './Polyline';

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
                "properties": {
                    "stroke": "#f06292",
                    "stroke-width": 15,
                    "stroke-opacity": 1,
                    "line-join": "round",
                    "line-cap": "round"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [person1, person2]
                }
            }
        ]
    }

    const dataLayer = {
        'id': 'route2',
        'type': 'line',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#0000ff',
            'line-width': 8
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
        onLoad={function () {
            if (!this.map) return;
            const map = this.map.getMap();
            map.addSource('route', {
                'type': 'geojson',
                'data': data
            })
            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#0000ff',
                    'line-width': 8
                }
            })
        }}
    >
        {markers}
        <Source type="geojson" data={data}>
            <Layer {...dataLayer} />
        </Source>
        <Polyline points={[person1, person2]}/>
    </ReactMapGL>);
}

export default App;
