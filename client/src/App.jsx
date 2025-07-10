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
      const detectedMood = await detectMood(imageRef.current);
      setMood(detectedMood);

      const recommended = moodToSongMap[detectedMood] || "Shape of You – Ed Sheeran";
      setSong(recommended);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 flex justify-center items-center gap-2">
          <span role="img" aria-label="music">🎵</span> Mood-Based Music Recommender
        </h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
        />

        {preview && (
  <div className="w-[250px] h-[250px] overflow-hidden rounded-xl shadow mx-auto mb-4">
    <img
      ref={imageRef}
      src={preview}
      alt="Uploaded"
      className="w-full h-full object-cover"
    />
  </div>
)}


        {mood && (
          <div className="text-lg text-gray-700">
            Mood: <span className="font-bold text-purple-700 capitalize">{mood}</span>
          </div>
        )}

        {song && (
          <div className="text-md text-gray-800">
            Recommended Song: <span className="font-semibold">{song}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
