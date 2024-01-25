import {LngLatLike} from 'mapbox-gl'

export const geojson = {
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
				data: [
					{
						label: 'Confissões',
						value: '<p>Sob agendamento</p>'
					},
					{
						label: 'Horário de Missas',
						value: '<p>Quinta-feira: 19:00</p><p>Domingo: 09:30 / 19:00</p>'
					},
					{
						label: 'Endereço',
						value:
							'<p>Rua Edson Dos Santos 30, Caraguatatuba - São Paulo, 11670-000, Brasil</p>'
					},
					{
						label: 'Telefone',
						value: '<p>+55 12 3888-4040</p>'
					},
					{
						label: 'WhatsApp',
						value: '<p>+55 12 98170-5757</p>'
					}
				]
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
				data: [
					{
						label: 'Confissões',
						value: '<p>Sob agendamento</p>'
					},
					{
						label: 'Horário de Missas',
						value:
							'<p>Terça-feira: 15:00</p><p>Sábado: 16:00</p><p>Domingo: 07:30 / 10:00 / 18:00</p>'
					},
					{
						label: 'Endereço',
						value:
							'Praca Rui Barbosa, Praca Rui Barbosa,158, Santo André, São Paulo 09210, Brasil'
					}
				]
			}
		}
	]
}
