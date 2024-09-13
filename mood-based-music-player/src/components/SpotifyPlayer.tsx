import React, { useEffect, useState } from 'react';
import './SpotifyPlayer.css';

interface SpotifyPlayerProps {
  accessToken: string;
  playlistUri: string;
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ accessToken, playlistUri }) => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Spotify.Track | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'Mood-Based Music Player',
        getOAuthToken: cb => { cb(accessToken); }
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        // Start playing the playlist when the device is ready
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
          method: 'PUT',
          body: JSON.stringify({ context_uri: playlistUri }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        });
      });

      player.addListener('player_state_changed', (state) => {
        if (state) {
          setIsPlaying(state.paused);
          setCurrentTrack(state.track_window.current_track);
        }
      });

      player.connect();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [accessToken, playlistUri]);

  const handlePlayPause = () => {
    player?.togglePlay();
  };

  const handleNext = () => {
    player?.nextTrack();
  };

  return (
    <div className="spotify-player">
      <div className="now-playing">
        {currentTrack && (
          <>
            <img src={currentTrack.album.images[0].url} alt="Album art" />
            <div className="track-info">
              <h3>{currentTrack.name}</h3>
              <p>{currentTrack.artists[0].name}</p>
            </div>
          </>
        )}
      </div>
      <div className="controls">
        <button onClick={handlePlayPause}>
          {isPlaying ? (
            <i className="fas fa-pause"></i>
          ) : (
            <i className="fas fa-play"></i>
          )}
        </button>
        <button onClick={handleNext}>
          <i className="fas fa-step-forward"></i>
        </button>
      </div>
    </div>
  );
};

export default SpotifyPlayer;
