'use client'

import React from 'react'
import {useEffect} from 'react'
import mapboxgl from 'mapbox-gl'

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import './page.module.css'
import './styles.css'
import Layout from '@/components/layout/Layout'
import {geojson} from './geojson'

const churchPopupHTML = ({
	title,
	data
}: {
	title: string
	data: {value: string; label: string}[]
}): string => `
	<div>
		<div class="mapboxgl-popup-header">
			<h3>${title}</h3>
		</div>
		<div class="mapboxgl-popup-body">
			<div class="mapboxgl-popup-contact-container">
				${data
					.map(({label, value}) => {
						return `<div class="mapboxgl-popup-contact-item">
							<h4>${label}:</h4>
							<div>${value}</div>
						</div>`
					})
					.join('')}
			</div>
		</div>
	</div>
`

export default function Map() {
	useEffect(() => {
		mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PK || ''

		const map = new mapboxgl.Map({
			container: 'map', // container ID
			style: 'mapbox://styles/mapbox/streets-v12', // style URL
			center: [-70, 10], // starting position [lng, lat]
			zoom: 1 // starting zoom
		})

		const markerIcon = document.createElement('div')
		markerIcon.className = 'marker'

		const marker = new mapboxgl.Marker({
			draggable: true
		})

		const geocoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			mapboxgl,
			placeholder: 'Encontre Igrejas perto',
			marker
		})

		geocoder.on('result', e => {
			const coordinates = e.result.geometry.coordinates
			const type = e.result.geometry.type
			const placeName = e.result.place_name
			console.log('result', e)
		})

		geocoder.on('clear', e => {
			console.log('clear')
		})

		for (const feature of geojson.features) {
			// make a marker for each feature and add to the map
			new mapboxgl.Marker({
				color: '#eea028'
			})
				.setLngLat(feature.geometry.coordinates)
				.setPopup(
					new mapboxgl.Popup({offset: 25}) // add popups
						.setHTML(churchPopupHTML(feature.properties))
				)
				.addTo(map)
		}

		map.addControl(geocoder)
		map.addControl(new mapboxgl.NavigationControl())
		map.addControl(new mapboxgl.GeolocateControl())
	}, [])
	return (
		<Layout>
			<div id="map" className="map" />
		</Layout>
	)
}
