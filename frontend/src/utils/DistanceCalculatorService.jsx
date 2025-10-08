// utils/distanceCalculator.js
export class DistanceCalculatorService {
  constructor() {
    this.directionsService = null;
    this.geocoder = null;
    this.isLoaded = false;
  }

  initialize() {
    if (window.google && window.google.maps && !this.isLoaded) {
      this.directionsService = new window.google.maps.DirectionsService();
      this.geocoder = new window.google.maps.Geocoder();
      this.isLoaded = true;
    }
  }

  async geocodeAddress(address) {
    if (!address) throw new Error('Address is required');
    
    this.initialize();
    if (!this.geocoder) {
      throw new Error('Google Maps not loaded');
    }

    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
            formatted_address: results[0].formatted_address
          });
        } else {
          reject(new Error(`Geocoding failed for "${address}": ${status}`));
        }
      });
    });
  }

  async calculateDistance(origin, destination, waypoints = []) {
    this.initialize();
    if (!this.directionsService) {
      throw new Error('Google Maps not loaded');
    }

    return new Promise((resolve, reject) => {
      const request = {
        origin,
        destination,
        waypoints: waypoints.map(point => ({ location: point, stopover: true })),
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC
      };

      this.directionsService.route(request, (result, status) => {
        if (status === 'OK' && result) {
          const route = result.routes[0];
          let totalDistance = 0;
          let totalDuration = 0;
          const legDetails = [];

          route.legs.forEach((leg, index) => {
            totalDistance += leg.distance.value;
            totalDuration += leg.duration.value;
            legDetails.push({
              startAddress: leg.start_address,
              endAddress: leg.end_address,
              distance: {
                text: leg.distance.text,
                value: leg.distance.value
              },
              duration: {
                text: leg.duration.text,
                value: leg.duration.value
              }
            });
          });

          resolve({
            totalDistance: {
              text: `${(totalDistance / 1000).toFixed(2)} km`,
              value: totalDistance
            },
            totalDuration: {
              text: `${Math.round(totalDuration / 60)} min`,
              value: totalDuration
            },
            legs: legDetails,
            route: result
          });
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      });
    });
  }

  async calculateSimpleDistance(point1, point2) {
    try {
      const result = await this.calculateDistance(point1, point2);
      return {
        distance: result.totalDistance,
        duration: result.totalDuration,
        success: true
      };
    } catch (error) {
      console.error('Distance calculation error:', error);
      return {
        distance: { text: 'Unknown', value: 0 },
        duration: { text: 'Unknown', value: 0 },
        success: false,
        error: error.message
      };
    }
  }

  async calculateDistanceFromAddresses(fromAddress, toAddress) {
    try {
      const [origin, destination] = await Promise.all([
        this.geocodeAddress(fromAddress),
        this.geocodeAddress(toAddress)
      ]);

      return await this.calculateSimpleDistance(origin, destination);
    } catch (error) {
      console.error('Address-based distance calculation error:', error);
      return {
        distance: { text: 'Unknown', value: 0 },
        duration: { text: 'Unknown', value: 0 },
        success: false,
        error: error.message
      };
    }
  }
}

export const distanceCalculator = new DistanceCalculatorService();
