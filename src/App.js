import React, { Component } from 'react';
import './App.css';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { createPassengerMarker, createBusStopMarker } from './images/marker';
import Polyline from './Polyline';

var passengers = require("./passengers.json");
var stops = require("./stops.json");

const mapboxAccessToken = "pk.eyJ1IjoiZmVsaXhsYXBpZXJyZSIsImEiOiJjazY5aXJ3bGswZzdrM2ZtcmY1cGxxeDNpIn0.WYhzLFieiQHNbp4LKyGWyw";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                width: 800,
                height: 600,
                latitude: 45.5129604703,
                longitude: -73.5729924601,
                zoom: 15
            },
            popup: null
        };
    }

    pythagoras(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    renderPopup() {
        var { popup } = this.state;

        return popup &&
            (<Popup
                tipSize={5}
                anchor="top"
                longitude={popup.lon}
                latitude={popup.lat}
                closeOnClick={false}
                onClose={() => this.setState({ popupInfo: null })}
            >
                Stop {popup.id} passengers {popup.count}
            </Popup>)
    }


    render() {

        const markers = [];
        const lines = [];
        const stopPassengerCounts = {};

        stops.forEach((stop, i) => {
            stopPassengerCounts[i] = 0;
        });

        passengers.forEach(passenger => {
            //Find the nearest bus stop
            let minDistance = Number.MAX_VALUE;
            let closestStop = stops[0];
            let closestStopIndex = 0;
            stops.forEach((stop, i) => {
                const distance = this.pythagoras(passenger.lon, passenger.lat, stop.lon, stop.lat);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestStop = stop;
                    closestStopIndex = i;
                }
            })
            const point1 = [passenger.lat, passenger.lon];
            const point2 = [closestStop.lat, closestStop.lon];

            lines.push(<Polyline points={[point1, point2]} />)

            stopPassengerCounts[closestStopIndex] += 1;

            markers.push(
                <Marker latitude={passenger.lat}
                    longitude={passenger.lon}>{createPassengerMarker()}</Marker>)
        });
        stops.forEach((stop, i) => {
            markers.push(
                <div onMouseEnter={() => {
                    this.setState({ popup: { lat: stop.lat, lon: stop.lon, id: i, count: stopPassengerCounts[i] } })
                }}
                    onMouseLeave={() => this.setState({ popup: null })}>
                    <Marker latitude={stop.lat}
                        longitude={stop.lon}>{createBusStopMarker()}</Marker>
                </div>
            )
        })

        return (<ReactMapGL {...this.state.viewport}
            onViewportChange={viewport => this.setState({ viewport })}
            mapboxApiAccessToken={mapboxAccessToken}
        >
            {lines}
            {markers}
            {this.renderPopup()}
        </ReactMapGL>);
    }
}