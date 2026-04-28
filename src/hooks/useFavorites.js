import { useState, useEffect } from "react";

function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos del localStorage al montar
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (parkingId) => {
    setFavorites((prev) => {
      if (prev.includes(parkingId)) {
        return prev.filter((id) => id !== parkingId);
      } else {
        return [...prev, parkingId];
      }
    });
  };

  const isFavorite = (parkingId) => {
    return favorites.includes(parkingId);
  };

  return { favorites, toggleFavorite, isFavorite };
}

export default useFavorites;
