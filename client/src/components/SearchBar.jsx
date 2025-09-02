import React from 'react';

/*
  SearchBar props:
   - value, onChange, onSubmit, onUseLocation
   - places: array of geocoding results
   - onSelectPlace(place)
*/
export default function SearchBar({ value, onChange, onSubmit, onUseLocation, places = [], onSelectPlace }) {
  return (
    <div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e)=> onChange(e.target.value)}
          onKeyDown={(e)=> e.key === 'Enter' && onSubmit()}
          placeholder="Search city (e.g., Tokyo)"
          className="w-full rounded-lg border px-3 py-2 focus:outline-none"
        />
        <button onClick={onSubmit} className="rounded-lg px-3 py-2 bg-primary text-white">Search</button>
        <button onClick={onUseLocation} title="Use current location" className="rounded-lg px-3 py-2 border">Use my location</button>
      </div>

      {places.length > 0 && (
        <div className="mt-2 border rounded-lg p-2 bg-white">
          {places.map((p) => (
            <div key={`${p.latitude}-${p.longitude}`} className="p-2 hover:bg-slate-50 rounded cursor-pointer" onClick={()=> onSelectPlace(p)}>
              <div className="font-medium">{p.name}{p.admin1 ? `, ${p.admin1}` : ''}{p.country ? `, ${p.country}` : ''}</div>
              <div className="text-xs text-slate-500">{p.latitude.toFixed(3)}, {p.longitude.toFixed(3)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
