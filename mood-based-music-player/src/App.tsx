import React, { useState } from 'react';
import MoodPrompt from './components/MoodPrompt';
import SpotifyPlayer from './components/SpotifyPlayer';
import { useSpotify } from './hooks/useSpotify';
import './App.css';

const App: React.FC = () => {
  const [playlistUri, setPlaylistUri] = useState<string | null>(null);
  const { accessToken, login, searchPlaylists } = useSpotify();
  const [isHeaderAnimated, setIsHeaderAnimated] = useState(false);

  const handleMoodSubmit = async (mood: string) => {
    if (!accessToken) {
      login();
      return;
    }
    const playlist = await searchPlaylists(mood);
    if (playlist) {
      setPlaylistUri(playlist.uri);
    } else {
      alert('Sorry, we couldn\'t find a playlist for that mood. Please try a different description.');
    }
  };

  const toggleHeaderAnimation = () => {
    setIsHeaderAnimated(!isHeaderAnimated);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 
          className={isHeaderAnimated ? 'animated' : ''}
          onClick={toggleHeaderAnimation}
          style={isHeaderAnimated ? { animation: 'colorChange 4s infinite' } : {}}
        >
          Moodify
        </h1>
      </header>
      <main className="App-main">
        <MoodPrompt onSubmit={handleMoodSubmit} />
        {playlistUri && accessToken && (
          <SpotifyPlayer accessToken={accessToken} playlistUri={playlistUri} />
        )}
      </main>
    </div>
  );
};

export default App;