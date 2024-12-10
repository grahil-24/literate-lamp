import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "./App.css";
require('dotenv').config()

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FirebaseAPI,
  authDomain: "sp-cds.firebaseapp.com",
  projectId: "sp-cds",
  storageBucket: "sp-cds.firebasestorage.app",
  messagingSenderId: "436085969043",
  appId: "1:436085969043:web:a968c143c6f04cf5423d66",
  measurementId: "G-LDGTHDXMZJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function to extract video ID from YouTube URL
const extractVideoID = (url) => {
    const regex = /[?&]v=([^&#]*)/;
    const match = url.match(regex);
    return match ? match[1] : null;
};


const App = () => {
    const [tiles, setTiles] = useState([]);
    const [youtubeTile, setYoutubeTile] = useState(null);

    useEffect(() => {
        const fetchTiles = async () => {
            const querySnapshot = await getDocs(collection(db, "tileInfo"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Separate YouTube tile based on URL
            const ytTile = data.find((tile) => tile.url.includes("youtube.com"));
            setYoutubeTile(ytTile);

            // Exclude YouTube tile from the main tiles list
            const otherTiles = data.filter((tile) => tile !== ytTile);
            setTiles(otherTiles);
        };

        fetchTiles();
    }, []);

    return (
        <div className="app">
            <h1>Courses</h1>
            <div className="tiles-container">
                {/* Display first 5 tiles */}
                {tiles.slice(0, 5).map((tile) => (
                    <div key={tile.id} className="tile">
                        <img src={tile.url} alt={tile.title} className="tile-image" />
                        <p className="tile-title">{tile.title}</p>
                        <p className="tile-description">{tile.description}</p>
                    </div>
                ))}

                {/* Display YouTube Tile as the 6th Tile */}
                {youtubeTile && (
                    <div className="tile youtube-tile">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${extractVideoID(
                                youtubeTile.url
                            )}`}
                            title={youtubeTile.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <p className="tile-title">{youtubeTile.title}</p>
                        <p className="tile-description">{youtubeTile.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}


export default App;

