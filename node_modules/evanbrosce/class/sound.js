class Sound {
  playSound(sound) {
    if(sound.readyState == 4) {
      if(sound.paused) {
        sound.play();
      }
    }
  }
  stopSound(sound) {
    if(sound.readyState == 4) {
      if(!sound.paused && sound.currentTime !== 0) {
        sound.pause();
        sound.currentTime = 0;
      }
    }
  }
  pauseSound(sound) {
    if(sound.readyState == 4) {
      if(!sound.paused) {
        sound.pause();
      }
    }
  }
  setVolume(sound, volume) {
    if(sound.readyState == 4) {
      if(volume > 0) {
        sound.volume = volume/100;
      }
    }
  }
}

export default Sound;