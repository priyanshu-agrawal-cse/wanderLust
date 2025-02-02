

    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    mapboxgl.accessToken = mapToken;
      const map = new mapboxgl.Map({
          container: 'map', // container ID
          center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
          zoom: 9 // starting zoom
      });


      const marker1 = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup({offset: 25})
      .setHTML("<p>exact location will be provided after booking </p>"))
      .addTo(map);
    // const marker1 = new mapboxgl.Marker()
    // .setLngLat([12.554729, 55.70651])
    // .addTo(map);
    console.log(coordinates);