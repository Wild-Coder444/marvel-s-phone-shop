import Box from "./box.jsx";
import "./Hero.css";
import axios from "axios";
import { useState, useEffect } from "react";

const url = "https://akabab.github.io/superhero-api/api/all.json";

const Hero = () => {
  const [heroes, setHeroes] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getdata() {
    try {
      setLoading(true);
      const response = await axios.get(url);
      setHeroes(response.data);
      setImages([response.data[0]]);
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getdata();
  }, []);

  async function refresh() {
    if (loading || heroes.length === 0) return;

    const available = heroes.filter(
      (item) => !images.some((img) => img.id === item.id),
    );

    if (available.length === 0) {
      alert("All images have been loaded!");
      return;
    }

    setLoading(true);

    const random = Math.floor(Math.random() * available.length);

    const newHero = available[random];

    const img = new Image();

    img.onload = () => {
      setImages((prev) => [newHero, ...prev]);
      setLoading(false);
    };

    img.onerror = () => {
      setLoading(false);
      alert("Image could not be loaded. Try again!");
    };

    img.src = newHero.images.lg;
  }

  return (
    <div className="hero">
      <div className="imgBox">
        {images.map((item) => (
          <Box key={item.id} img={item.images.lg} />
        ))}
      </div>

      <button className="btn" onClick={refresh} disabled={loading || heroes.length === 0}>
        {loading ? "Searching..." : "Refresh"}
      </button>
    </div>
  );
};

export default Hero;
