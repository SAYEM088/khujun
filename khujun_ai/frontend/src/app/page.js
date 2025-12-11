'use client';

import { useState } from 'react';
import { Search, Loader2, Crosshair, AlertCircle, Navigation } from 'lucide-react';

export default function Home() {
  const [location, setLocation] = useState({ lat: 23.8103, lon: 90.4125 });
  const [poiType, setPoiType] = useState('school');
  const [howMany, setHowMany] = useState(5);
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchNearby = async () => {
    setLoading(true);
    setError('');
    setSearched(true);
    setPois([]);

    try {
      const res = await fetch('http://localhost:8000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: location.lat,
          longitude: location.lon,
          poi_type: poiType,
          count: howMany,
          device: 'cpu',
        }),
      });

      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      console.log(data.pois)
      setPois(data.pois || []);
    } catch {
      setError('Cannot connect to backend (port 8000)');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lon: Number(pos.coords.longitude.toFixed(6)),
        });
        setError('');
      },
      () => setError('Location permission denied')
    );
  };

  const openGoogleMapsDirections = (poiLat, poiLon) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lon}&destination=${poiLat},${poiLon}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const placeLabels = {
    school: 'Schools',
    hospital: 'Hospitals',
    bank: 'Banks',
    restaurant: 'Restaurants',
    fuel: 'Fuel Stations',
    place_of_worship: 'Places of Worship',
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* ---------------- HEADER ---------------- */}
      <header className="pt-20 pb-14 text-center px-6">
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-gray-900 leading-tight">
          Find places nearby
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          AI-powered • Instant • Accurate
        </p>
      </header>

      {/* ---------------- CONTROLS ---------------- */}
      <section className="max-w-2xl mx-auto px-6 mb-24 flex-1">
        <div className="space-y-8">

          {/* Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              step="0.000001"
              value={location.lat}
              onChange={(e) => setLocation({ ...location, lat: parseFloat(e.target.value) || 0 })}
              placeholder="Latitude"
              className="px-8 py-5 text-lg text-center bg-gray-50 rounded-full border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
            />
            <input
              type="number"
              step="0.000001"
              value={location.lon}
              onChange={(e) => setLocation({ ...location, lon: parseFloat(e.target.value) || 0 })}
              placeholder="Longitude"
              className="px-8 py-5 text-lg text-center bg-gray-50 rounded-full border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
            />
          </div>

          <button
            onClick={getCurrentLocation}
            className="w-full flex items-center justify-center gap-3 py-4 text-blue-600 font-medium hover:text-blue-700 transition"
          >
            <Crosshair className="w-5 h-5" />
            Use my current location
          </button>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={poiType}
              onChange={(e) => setPoiType(e.target.value)}
              className="px-8 py-5 text-lg bg-white border border-gray-200 rounded-full focus:outline-none focus:border-gray-400"
            >
              {Object.entries(placeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              max="30"
              value={howMany}
              onChange={(e) => setHowMany(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
              className="px-10 py-5 text-lg text-center bg-white border border-gray-200 rounded-full focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Search Button */}
          <div className="text-center pt-8">
            <button
              onClick={fetchNearby}
              disabled={loading}
              className="inline-flex items-center gap-4 px-16 py-6 bg-black text-white text-xl rounded-full font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Search className="w-7 h-7" />}
              {loading ? 'Searching…' : 'Search'}
            </button>
          </div>

          {error && (
            <p className="text-center text-red-600 flex items-center justify-center gap-2 mt-4">
              <AlertCircle className="w-5 h-5" />
              {error}
            </p>
          )}
        </div>
      </section>

      {/* ---------------- RESULTS ---------------- */}
      {searched && pois.length > 0 && (
        <section className="px-6 pb-28 max-w-5xl mx-auto flex-1">
          <h2 className="text-4xl font-light text-center mb-16 text-gray-800">
            {pois.length} {placeLabels[poiType]} found
          </h2>

          <ol className="space-y-12">
            {pois.map((poi, index) => (
              <li key={index} className="border-b border-gray-100 pb-12 last:border-0">
                <div className="grid md:grid-cols-12 gap-8 items-start">

                  <div className="md:col-span-1 text-center md:text-right">
                    <span className="text-6xl font-extralight text-gray-200">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="md:col-span-7">
                    <h3 className="text-2xl font-medium text-gray-900 leading-snug">
                      {poi.name}
                    </h3>
                    <p className="mt-2 text-lg text-gray-500">
                      {poi.category} • {poi.type}
                    </p>
                    {poi.summary && (
                      <p className="mt-5 text-lg text-gray-600 italic leading-relaxed">
                        “{poi.summary}”
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-4 text-left md:text-right">
                    <div className="text-4xl font-light text-blue-600 mb-4">
                      {poi.distance_km.toFixed(1)}
                      <span className="text-lg ml-1 text-gray-500">km</span>
                    </div>

                    <button
                      onClick={() => openGoogleMapsDirections(poi.lat, poi.lon)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium text-sm hover:bg-blue-700 transition shadow-md"
                    >
                      <Navigation className="w-4 h-4" />
                      Directions
                    </button>
                  </div>

                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {searched && pois.length === 0 && !loading && (
        <div className="text-center py-32 text-2xl text-gray-400 flex-1">
          No results found.
        </div>
      )}

     
      <footer className="mt-auto border-t border-gray-200 bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} <span className="font-medium">Md Abu Sayem Sarker</span>. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Built with Next.js, FastApi & LLaMa
          </p>
        </div>
      </footer>
    </main>
  );
}