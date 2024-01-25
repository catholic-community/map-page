'use client'

import React from 'react'
import {useEffect} from 'react'
import mapboxgl from 'mapbox-gl'

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import './page.module.css'
import './styles.css'

export default function Home() {
	useEffect(() => {
		mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PK || ''

		const map = new mapboxgl.Map({
			container: 'map', // container ID
			style: 'mapbox://styles/mapbox/streets-v12', // style URL
			center: [-70, 10], // starting position [lng, lat]
			zoom: 1 // starting zoom
		})

		const geocoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			mapboxgl: mapboxgl
		})

		map.addControl(geocoder)

		const geocoderElement = document.getElementById('geocoder')

		if (geocoderElement && geocoderElement.childElementCount === 0) {
			geocoderElement.appendChild(geocoder.onAdd(map))
		}
	}, [])
	return (
		<>
			<div id="geocoder" className="geocoder" />
			<div id="map" className="map" />
		</>
	)
}
