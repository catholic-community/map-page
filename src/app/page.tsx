'use client'

import React from 'react'
import {useEffect} from 'react'
import mapboxgl from 'mapbox-gl'

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import './page.module.css'
import './styles.css'
import Layout from '@/components/layout/Layout'
import {geojson} from './geolocationData'

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

		map.on('zoomend', e => {
			const zoom = map.getZoom()

			if (zoom >= 6) {
				document.querySelectorAll('.mapboxgl-marker').forEach(marker => {
					marker.classList.add('mapboxgl-marker-active')
				})
			}
		})

		map.on('zoom', e => {
			const zoom = map.getZoom()

			if (zoom < 6) {
				document.querySelectorAll('.mapboxgl-marker').forEach(marker => {
					marker.classList.remove('mapboxgl-marker-active')
				})
			}
		})

		map.on('load', () => {
			map.addSource('earthquakes', {
				type: 'geojson',
				data: '/churches.geojson',
				cluster: true,
				clusterMaxZoom: 14, // Max zoom to cluster points on
				clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
			})

			map.addLayer({
				id: 'clusters',
				type: 'circle',
				source: 'earthquakes',
				filter: ['has', 'point_count'],
				maxzoom: 14,
				minzoom: 0,
				paint: {
					'circle-color': [
						'step',
						['get', 'point_count'],
						'#eea028',
						100,
						'#d99124',
						750,
						'#bc7e21'
					],
					'circle-radius': [
						'step',
						['get', 'point_count'],
						20,
						100,
						30,
						750,
						40
					]
				}
			})

			map.addLayer({
				id: 'cluster-count',
				type: 'symbol',
				source: 'earthquakes',
				filter: ['has', 'point_count'],
				layout: {
					'text-field': ['get', 'point_count_abbreviated'],
					'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
					'text-size': 16
				}
			})

			map.addLayer({
				id: 'unclustered-point',
				type: 'circle',
				source: 'earthquakes',
				filter: ['!', ['has', 'point_count']],
				paint: {
					'circle-color': '#eea028',
					'circle-radius': 4,
					'circle-stroke-width': 1,
					'circle-stroke-color': '#eea028'
				}
			})
		})
	}, [])
	return (
		<Layout>
			<div id="map" className="map" />
		</Layout>
	)
}
