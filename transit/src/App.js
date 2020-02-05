import React, {useState} from 'react';
import './App.css';
import ReactMapGL from 'react-map-gl';

var passengers = require("./passengers.json");
var stops = require("./stops.json");

const mapboxAccessToken = "pk.eyJ1IjoiZmVsaXhsYXBpZXJyZSIsImEiOiJjazY5aXJ3bGswZzdrM2ZtcmY1cGxxeDNpIn0.WYhzLFieiQHNbp4LKyGWyw";

function App() {
    const [viewPort, setViewport] = useState({
        width: 800,
        height: 600,
        latitude: 45.5129604703,
        longitude: -73.5729924601,
        zoom: 12
    })

    return (<ReactMapGL {...viewPort}
        onViewportChange={setViewport}
        mapboxApiAccessToken={mapboxAccessToken}/>);
}

export default App;
