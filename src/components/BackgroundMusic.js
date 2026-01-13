import React, { useEffect, useState, useRef } from 'react';
import { Audio } from 'expo-av';
import { useGame } from '../context/GameContext';

const BackgroundMusic = () => {
  const { musicOn } = useGame();
  const [sound, setSound] = useState();
  const soundRef = useRef(null);

  useEffect(() => {
    async function initMusic() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        const { sound: newSound } = await Audio.Sound.createAsync(
           require('../../assets/music.mp3'),
           { isLooping: true, volume: 0.5 }
        );
        
        soundRef.current = newSound;
        setSound(newSound);
      } catch (error) {
        console.log('Error loading sound. Make sure assets/music.mp3 exists.', error);
      }
    }

    initMusic();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    const managePlayback = async () => {
      if (sound) {
        try {
          if (musicOn) {
            const status = await sound.getStatusAsync();
            if (!status.isPlaying) {
              await sound.playAsync();
            }
          } else {
            await sound.pauseAsync();
          }
        } catch (e) {
          console.log("Playback error:", e);
        }
      }
    };
    
    managePlayback();
  }, [musicOn, sound]);

  return null;
};

export default BackgroundMusic;
