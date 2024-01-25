import { LngLatLike } from "mapbox-gl";

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