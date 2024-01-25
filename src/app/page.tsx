'use client'

import React from 'react'
import {useEffect} from 'react'
import mapboxgl, {LngLatLike} from 'mapbox-gl'

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import './page.module.css'
import './styles.css'
import Layout from '@/components/layout/Layout'

const churchPopupHTML = ({
	title,
	address,
	landlinePhone,
	whatsApp
}: {
	title: string
	address: string
	landlinePhone?: string
	whatsApp?: string
}): string => `
	<div>
		<div class="mapboxgl-popup-header">
			<h3>${title}</h3>
		</div>
		<div class="mapboxgl-popup-body">
			<div class="mapboxgl-popup-contact-container">
				<div class="mapboxgl-popup-contact-item">
					<h4>Endereço:</h4>
					<p>${address}</p>
				</div>
				${
					landlinePhone
						? `<div class="mapboxgl-popup-contact-item"><h4>Telefone Fixo:</h4>
								<p>${landlinePhone}</p>
							</div>`
						: ''
				}
				${
					whatsApp
						? `<div class="mapboxgl-popup-contact-item"><h4>WhatsApp:</h4>
								<p>${whatsApp}</p>
							</div>`
						: ''
				}
			</div>
		</div>
	</div>
`

export default function Map() {
	useEffect(() => {
		mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PK || ''

		const geojson = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [-45.448841, -23.676663] as LngLatLike
					},
					properties: {
						title: 'Paróquia São José',
						address:
							'Rua Edson Dos Santos 30, Caraguatatuba - São Paulo, 11670-000, Brasil',
						landlinePhone: '+55 12 3888-4040',
						whatsApp: '+55 12 98170-5757'
					}
				},
				{
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [-46.534713, -23.635775] as LngLatLike
					},
					properties: {
						title: 'Paróquia Santa Teresinha',
						address:
							'Praca Rui Barbosa, Praca Rui Barbosa,158, Santo André, São Paulo 09210, Brasil'
					}
				}
			]
		}

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
						.setHTML(
							churchPopupHTML({
								title: feature.properties.title,
								address: feature.properties.address,
								landlinePhone: feature.properties.landlinePhone,
								whatsApp: feature.properties.whatsApp
							})
						)
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
