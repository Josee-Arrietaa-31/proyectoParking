function ParkingAmenities({ amenities }) {
  if (!amenities) return null;

  const amenitiesList = [
    { key: "covered", icon: "🏢", label: "Techado", color: "bg-blue-100 text-blue-700" },
    { key: "ev_charging", icon: "🔌", label: "Carga EV", color: "bg-green-100 text-green-700" },
    { key: "security", icon: "🔒", label: "Seguridad", color: "bg-amber-100 text-amber-700" },
    { key: "accessibility", icon: "♿", label: "Accesibilidad", color: "bg-purple-100 text-purple-700" }
  ];

  const activeAmenities = amenitiesList.filter(a => amenities[a.key]);

  if (activeAmenities.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {activeAmenities.map((amenity) => (
        <span
          key={amenity.key}
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${amenity.color}`}
          title={amenity.label}
        >
          <span>{amenity.icon}</span>
          <span>{amenity.label}</span>
        </span>
      ))}
    </div>
  );
}

export default ParkingAmenities;
