import axios from 'axios';

export const getAddressCoordinates = async (address: string) => {
  const apiKey = import.meta.env.VITE_GOMAPPRO_API_KEY;
  const url = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
        formatted_address: response.data.results[0].formatted_address,
      };
    }
    throw new Error('Unable to fetch coordinates');
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw error;
  }
};

export const getRouteDetails = async (origin: string, destination: string) => {
  const apiKey = import.meta.env.VITE_GOMAPPRO_API_KEY;
  const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === 'OK') {
      const result = response.data.rows[0].elements[0];
      if (result.status === 'OK') {
        return {
          distance: result.distance.text,
          duration: result.duration.text,
          distanceValue: result.distance.value, // in meters
          durationValue: result.duration.value, // in seconds
        };
      }
      throw new Error('No route found');
    }
    throw new Error('Unable to fetch route details');
  } catch (error) {
    console.error('Error fetching route details:', error);
    throw error;
  }
};

export const getLocationSuggestions = async (input: string) => {
  const apiKey = import.meta.env.VITE_GOMAPPRO_API_KEY;
  const url = `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === 'OK') {
      return response.data.predictions.map((prediction: any) => ({
        description: prediction.description,
        placeId: prediction.place_id,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};