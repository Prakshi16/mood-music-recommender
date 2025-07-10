import React, { useState, useRef, useEffect } from "react";
import { loadModels, detectMood } from "./utils/moodDetector";

const moodToSongMap = {
  happy: "Levitating – Dua Lipa",
  sad: "Someone Like You – Adele",
  angry: "Breaking the Habit – Linkin Park",
  surprised: "Feel It Still – Portugal. The Man",
  neutral: "Let Her Go – Passenger",
  fearful: "Creep – Radiohead",
  disgusted: "Numb – Linkin Park",
};

function App() {
  const [preview, setPreview] = useState(null);
  const [mood, setMood] = useState("");
  const [song, setSong] = useState("");
  const imageRef = useRef();

  useEffect(() => {
    loadModels();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setPreview(reader.result);
      setMood("Detecting...");
      setSong("");

      await new Promise((res) => setTimeout(res, 1000));
 // Wait for <img> to render

      const detectedMood = await detectMood(imageRef.current);
      setMood(detectedMood);

      const recommended = moodToSongMap[detectedMood] || "Shape of You – Ed Sheeran";
      setSong(recommended);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">🎵 Mood-Based Music Recommender</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      {preview && (
        <img
          ref={imageRef}
          src={preview}
          alt="Preview"
          //className="max-w-xs max-h-80 object-contain rounded-lg shadow-md mb-4"
          className="w-[300px] h-auto rounded-lg shadow-md object-contain mb-4"
        />
      )}

      {mood && (
        <p className="text-xl">
          Mood: <strong>{mood.charAt(0).toUpperCase() + mood.slice(1)}</strong>
        </p>
      )}

      {song && (
        <p className="mt-2 text-lg">
          Recommended Song: <strong>{song}</strong>
        </p>
      )}
    </div>
  );
}

export default App;
