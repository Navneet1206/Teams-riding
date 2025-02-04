import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

const LiveMap = ({ sourceCoords, destinationCoords, minimized = true }) => {
  const [currentPosition, setCurrentPosition] = useState({ lat: -33.8688, lng: 151.2195 });
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [isExpanded, setIsExpanded] = useState(!minimized);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.gomaps.pro/maps/api/js?key=${import.meta.env.VITE_GOMAPPRO_API_KEY}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => initializeMap();
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const initializeMap = () => {
    const mapElement = document.getElementById('map');
    if (mapElement && !map) {
      const newMap = new window.google.maps.Map(mapElement, {
        center: currentPosition,
        zoom: 15,
        gestureHandling: 'greedy',
        styles: [
          {
            "elementType": "geometry",
            "stylers": [{ "color": "#f5f5f5" }]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#333333" }]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#ffffff" }]
          }
        ]
      });
      setMap(newMap);

      const newMarker = new window.google.maps.Marker({
        position: currentPosition,
        map: newMap,
        title: "Current Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#000000",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#FFFFFF",
        }
      });
      setMarker(newMarker);
    }
  };

  useEffect(() => {
    if (map && marker) {
      map.setCenter(currentPosition);
      marker.setPosition(currentPosition);
    }
  }, [currentPosition]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  useEffect(() => {
    if (map && sourceCoords && destinationCoords) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#000000",
          strokeWeight: 4
        }
      });
      directionsRenderer.setMap(map);

      const request = {
        origin: new window.google.maps.LatLng(sourceCoords.lat, sourceCoords.lng),
        destination: new window.google.maps.LatLng(destinationCoords.lat, destinationCoords.lng),
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        }
      });
    }
  }, [map, sourceCoords, destinationCoords]);

  useEffect(() => {
    if (socket) {
      socket.on('captain-location-update', (location) => {
        setCurrentPosition({ lat: location.lat, lng: location.lng });
      });
    }

    return () => {
      if (socket) {
        socket.off('captain-location-update');
      }
    };
  }, [socket]);

  const toggleMapSize = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`relative transition-all duration-300 ease-in-out ${
      isExpanded ? 'fixed inset-0 z-50' : 'h-48 w-48 rounded-lg overflow-hidden'
    }`}>
      <div id="map" className="w-full h-full" />
      <button
        onClick={toggleMapSize}
        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg z-10 hover:bg-gray-100"
      >
        {isExpanded ? (
          <span className="text-black">Minimize</span>
        ) : (
          <span className="text-black">Expand</span>
        )}
      </button>
    </div>
  );
};

export default LiveMap;