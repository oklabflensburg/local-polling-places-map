fetch('/data/wahlbezirke_flensburg.geojson', {
    method: 'GET'
})
.then((response) => {
    return response.json()
})
.then((data) => {
    addData(data);
})
.catch(function (error) {
    console.log(error);
})


const map = L.map('map').setView([54.788491708399,9.43578807487305], 14)


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 13,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)


let geocoder = L.Control.Geocoder.nominatim()

if (typeof URLSearchParams !== 'undefined' && location.search) {
    // parse /?geocoder=nominatim from URL
    let params = new URLSearchParams(location.search)
    let geocoderString = params.get('geocoder')

    if (geocoderString && L.Control.Geocoder[geocoderString]) {
        console.log('Using geocoder', geocoderString)
        geocoder = L.Control.Geocoder[geocoderString]()
    } else if (geocoderString) {
        console.warn('Unsupported geocoder', geocoderString)
    }
}

const osmGeocoder = new L.Control.geocoder({
    query: 'Flensburg',
    position: 'topright',
    placeholder: 'Adresse oder Ort',
    defaultMarkGeocode: false
}).addTo(map)

osmGeocoder.on('markgeocode', e => {
    const bounds = L.latLngBounds(e.geocode.bbox._southWest, e.geocode.bbox._northEast)
    map.fitBounds(bounds)
})


function onMapClick(evt) {
    const latLngs = [evt.target.getLatLng()]
    const markerBounds = L.latLngBounds(latLngs)
    map.fitBounds(markerBounds)

    // const imageSource = evt.target.feature.properties.image
    const infoName = evt.target.feature.properties.name
    const infoDistrict = evt.target.feature.properties.district
    const infoAddress = evt.target.feature.properties.address
    const infoPostalcode = evt.target.feature.properties.postal_code
    const infoCity = evt.target.feature.properties.city

    // const imageElement = document.createElement('img')
    const titleElement = document.createElement('p')
    titleElement.innerHTML = `<p class="font-medium mb-2">Wahlbezirk: ${infoDistrict}</p>${infoName}<br>${infoAddress}<br>${infoPostalcode} ${infoCity}`

    titleElement.classList.add('text-xl', 'open-sans', 'bg-gray-100', 'p-3')

    // imageElement.classList.add('p-3')
    // imageElement.setAttribute('src', `${imageSource}?v=1`)
    // imageElement.setAttribute('target', '_blank')
 
    document.getElementById('details').innerHTML = ''
    // document.getElementById('details').appendChild(imageElement)
    document.getElementById('details').appendChild(titleElement)

    evt.preventDefault
}


function onEachFeature(feature, layer) {
    const label = `Ort ${feature.properties.name}`

    layer.on('click', function(evt) {
        onMapClick(evt)
    })

    layer.bindTooltip(label, {
        permanent: false,
        direction: 'top'
    }).openTooltip()
}


function addData(data) {
    const layer = L.geoJson(data, {
        onEachFeature: onEachFeature
    }).addTo(map)

    map.fitBounds(layer.getBounds())
}
