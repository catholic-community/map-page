'use client'

import React from 'react'
import {useEffect} from 'react'
import styles from './page.module.css'
import mapboxgl from 'mapbox-gl'

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

export default function Home() {
	useEffect(() => {
		mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PK || ''

		const map = new mapboxgl.Map({
			container: 'map', // container ID
			style: 'mapbox://styles/mapbox/streets-v12', // style URL
			center: [-70, 10], // starting position [lng, lat]
			zoom: 1 // starting zoom
		})

		map.addControl(
			new MapboxGeocoder({
				accessToken: mapboxgl.accessToken,
				mapboxgl: mapboxgl
			})
		)
	}, [])
	return <div id="map" style={{width: '100%', height: '100vh'}}></div>
}
