'use client'

import React from 'react'
import {useEffect} from 'react'
import mapboxgl from 'mapbox-gl'

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import './page.module.css'
import './styles.css'
import Layout from '@/components/layout/Layout'

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

			console.log(e.result.center)
			geocoder.clear()
			new mapboxgl.Marker({draggable: true})
				.setLngLat(e.result.center)
				.addTo(map)
		})

		map.addControl(geocoder)
		map.addControl(new mapboxgl.NavigationControl())
		map.addControl(new mapboxgl.GeolocateControl())

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

			map.loadImage('/marker.png', (error, image) => {
				if (error) {
					throw error
				}

				if (image) {
					map.addImage('unclustered-marker', image)

					map.addLayer({
						id: 'unclustered-point',
						type: 'symbol',
						source: 'earthquakes',
						filter: ['!', ['has', 'point_count']],
						layout: {
							'icon-image': 'unclustered-marker',
							'icon-size': 0.15,
							'icon-allow-overlap': true
						}
					})
				}
			})

			map.on('click', 'unclustered-point', function (e) {
				if (e.features && e.features[0].properties) {
					// make a marker for each feature and add to the map
					const properties = e.features[0].properties as {
						title: string
						data: string
					}

					const title = properties.title
					const data = JSON.parse(properties.data) as {
						label: string
						value: string
					}[]

					new mapboxgl.Popup({offset: 25})
						.setLngLat([e.lngLat.lng, e.lngLat.lat])
						.setHTML(churchPopupHTML({title, data}))
						.addTo(map)
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
