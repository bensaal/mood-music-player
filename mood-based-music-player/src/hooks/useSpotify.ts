import { useState, useEffect } from 'react';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID || '';
const REDIRECT_URI = 'http://localhost:3000/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

export const useSpotify = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial: { [key: string]: string }, item) => {
        const parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
      }, {});

    if (hash.access_token) {
      console.log('Access token found in URL');
      setAccessToken(hash.access_token);
      window.location.hash = '';
    }
  }, []);

  const login = () => {
    console.log('Initiating Spotify login');
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;
  };

  const searchPlaylists = async (query: string) => {
    if (!accessToken) {
      console.log('No access token available');
      return null;
    }

    // Extract key words from the query
    const keywords = query.split(' ').filter(word => word.length > 3).join(' ');
    console.log('Searching for playlists with keywords:', keywords);
    
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(keywords)}&type=playlist&limit=5`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    console.log('Search response:', data);
    
    if (data.playlists && data.playlists.items.length > 0) {
      return data.playlists.items[0];
    } else {
      console.log('No playlists found, trying generic search');
      const genericResponse = await fetch(`https://api.spotify.com/v1/search?q=mood&type=playlist&limit=5`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const genericData = await genericResponse.json();
      console.log('Generic search response:', genericData);
      return genericData.playlists.items[0] || null;
    }
  };

  return { accessToken, login, searchPlaylists };
};
