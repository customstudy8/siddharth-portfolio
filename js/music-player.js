/* ============================================
   SIDDHARTH MISHRA
   FIXED OFFLINE MUSIC PLAYER
============================================ */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const player = $("smMusic");
  const audio = $("smAudio");

  if (!player || !audio || player.dataset.ready === "true") return;
  player.dataset.ready = "true";

  const tracks = [
    {
      title: "My First Track",
      artist: "Siddharth Mishra",
      src: "assets/music/song-1.mp3"
    },
    {
      title: "My Second Track",
      artist: "Personal Collection",
      src: "assets/music/song-2.mp3"
    },
    {
      title: "My Third Track",
      artist: "Personal Collection",
      src: "assets/music/song-3.mp3"
    }
  ];

  const playButton = $("smPlay");
  const playIcon = $("smPlayIcon");
  const title = $("smTitle");
  const artist = $("smArtist");
  const status = $("smStatus");
  const statusDot = $("smStatusDot");
  const seek = $("smSeek");
  const currentTime = $("smCurrent");
  const duration = $("smDuration");
  const volume = $("smVolume");
  const muteButton = $("smMute");
  const shuffleButton = $("smShuffle");
  const repeatButton = $("smRepeat");
  const playlist = $("smPlaylist");
  const trackList = $("smTrackList");
  const playlistToggle = $("smPlaylistToggle");
  const collapseButton = $("smCollapse");
  const collapseIcon = $("smCollapseIcon");

  let currentIndex = 0;
  let shuffle = false;
  let repeatMode = "off";
  let previousVolume = Number(volume.value);
  let requestId = 0;

  function formatTime(value) {
    if (!Number.isFinite(value) || value < 0) return "0:00";

    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  function setStatus(message, playing = false) {
    status.textContent = message;
    statusDot.classList.toggle("is-playing", playing);
  }

  function updatePlayButton(playing) {
    playIcon.textContent = playing ? "Ⅱ" : "▶";
    playButton.setAttribute(
      "aria-label",
      playing ? "Pause music" : "Play music"
    );
    playButton.title = playing ? "Pause" : "Play";
  }

  function updateActiveTrack() {
    [...trackList.children].forEach((button, index) => {
      const active = index === currentIndex;

      button.classList.toggle("is-active", active);

      if (active) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  }

  function renderPlaylist() {
    trackList.replaceChildren();

    tracks.forEach((track, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sm-music__track-btn";

      const trackTitle = document.createElement("span");
      trackTitle.className = "sm-music__track-btn-title";
      trackTitle.textContent =
        `${String(index + 1).padStart(2, "0")}  ${track.title}`;

      const trackArtist = document.createElement("span");
      trackArtist.className = "sm-music__track-btn-artist";
      trackArtist.textContent = track.artist;

      button.append(trackTitle, trackArtist);

      button.addEventListener("click", () => {
        loadTrack(index, true);
      });

      trackList.appendChild(button);
    });

    $("smCount").textContent = String(tracks.length).padStart(2, "0");
    updateActiveTrack();
  }

  function loadTrack(index, autoplay = false) {
    if (!tracks.length) return;

    requestId++;
    currentIndex = (index + tracks.length) % tracks.length;

    const track = tracks[currentIndex];

    audio.pause();
    audio.loop = repeatMode === "one";
    audio.src = track.src;
    audio.load();

    title.textContent = track.title;
    artist.textContent = track.artist;

    seek.value = "0";
    seek.disabled = true;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    updatePlayButton(false);
    setStatus("LOCAL MUSIC LIBRARY");
    updateActiveTrack();

    if (autoplay) playTrack();
  }

  async function playTrack() {
    if (!tracks.length) return;

    if (!audio.getAttribute("src")) {
      loadTrack(currentIndex);
    }

    const thisRequest = ++requestId;

    try {
      await audio.play();

      if (thisRequest !== requestId) return;

      updatePlayButton(true);
      setStatus("NOW PLAYING", true);
    } catch (error) {
      if (thisRequest !== requestId) return;

      updatePlayButton(false);

      if (error.name === "NotAllowedError") {
        setStatus("TAP PLAY TO START");
      } else {
        setStatus("CHECK MUSIC FILE");
      }
    }
  }

  function pauseTrack() {
    requestId++;
    audio.pause();
    updatePlayButton(false);
    setStatus("PLAYBACK PAUSED");
  }

  function nextTrack() {
    if (!tracks.length) return;

    if (shuffle && tracks.length > 1) {
      let nextIndex;

      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (nextIndex === currentIndex);

      loadTrack(nextIndex, true);
      return;
    }

    if (currentIndex < tracks.length - 1) {
      loadTrack(currentIndex + 1, true);
    } else if (repeatMode === "all") {
      loadTrack(0, true);
    } else {
      audio.pause();
      audio.currentTime = 0;
      updatePlayButton(false);
      setStatus("PLAYLIST COMPLETE");
    }
  }

  function previousTrack() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    if (shuffle && tracks.length > 1) {
      let previousIndex;

      do {
        previousIndex = Math.floor(Math.random() * tracks.length);
      } while (previousIndex === currentIndex);

      loadTrack(previousIndex, true);
      return;
    }

    if (currentIndex > 0) {
      loadTrack(currentIndex - 1, true);
    } else if (repeatMode === "all") {
      loadTrack(tracks.length - 1, true);
    } else {
      audio.currentTime = 0;
    }
  }

  playButton.addEventListener("click", () => {
    if (audio.paused) {
      playTrack();
    } else {
      pauseTrack();
    }
  });

  $("smNext").addEventListener("click", nextTrack);
  $("smPrevious").addEventListener("click", previousTrack);

  shuffleButton.addEventListener("click", () => {
    shuffle = !shuffle;

    shuffleButton.setAttribute("aria-pressed", String(shuffle));
    shuffleButton.setAttribute(
      "aria-label",
      shuffle ? "Shuffle on" : "Shuffle off"
    );

    setStatus(shuffle ? "SHUFFLE ENABLED" : "LOCAL MUSIC LIBRARY");
  });

  repeatButton.addEventListener("click", () => {
    if (repeatMode === "off") {
      repeatMode = "all";
    } else if (repeatMode === "all") {
      repeatMode = "one";
    } else {
      repeatMode = "off";
    }

    audio.loop = repeatMode === "one";

    const labels = {
      off: "Repeat off",
      all: "Repeat playlist",
      one: "Repeat current track"
    };

    repeatButton.setAttribute("aria-label", labels[repeatMode]);
    repeatButton.title = labels[repeatMode];
    repeatButton.setAttribute(
      "aria-pressed",
      String(repeatMode !== "off")
    );

    setStatus(
      repeatMode === "one"
        ? "REPEAT TRACK"
        : repeatMode === "all"
          ? "REPEAT PLAYLIST"
          : "LOCAL MUSIC LIBRARY"
    );
  });

  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    audio.muted = audio.volume === 0;

    if (audio.volume > 0) {
      previousVolume = audio.volume;
    }

    muteButton.textContent = audio.muted ? "×" : "♪";
    muteButton.setAttribute(
      "aria-label",
      audio.muted ? "Unmute audio" : "Mute audio"
    );
  });

  muteButton.addEventListener("click", () => {
    if (audio.muted || audio.volume === 0) {
      audio.muted = false;

      const restoredVolume = previousVolume || 0.7;
      audio.volume = restoredVolume;
      volume.value = String(restoredVolume);
    } else {
      previousVolume = audio.volume;
      audio.muted = true;
    }

    muteButton.textContent = audio.muted ? "×" : "♪";
    muteButton.setAttribute(
      "aria-label",
      audio.muted ? "Unmute audio" : "Mute audio"
    );
  });

  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
    seek.disabled = false;
  });

  audio.addEventListener("durationchange", () => {
    duration.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    currentTime.textContent = formatTime(audio.currentTime);

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      seek.value = String((audio.currentTime / audio.duration) * 1000);
    }
  });

  seek.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
    }
  });

  audio.addEventListener("play", () => {
    updatePlayButton(true);
    setStatus("NOW PLAYING", true);
  });

  audio.addEventListener("pause", () => {
    updatePlayButton(false);

    if (audio.currentTime > 0 && !audio.ended) {
      setStatus("PLAYBACK PAUSED");
    }
  });

  audio.addEventListener("ended", () => {
    if (repeatMode === "one") return;
    nextTrack();
  });

  audio.addEventListener("error", () => {
    updatePlayButton(false);
    setStatus("FILE NOT FOUND — CHECK PATH");
    seek.disabled = true;
  });

  playlistToggle.addEventListener("click", () => {
    const opening = playlist.hidden;
    playlist.hidden = !opening;

    playlistToggle.setAttribute("aria-expanded", String(opening));
    playlistToggle.firstChild.textContent = opening ? "HIDE " : "TRACKS ";
  });

  collapseButton.addEventListener("click", () => {
    const collapsed = player.classList.toggle("is-collapsed");

    collapseButton.setAttribute("aria-expanded", String(!collapsed));
    collapseButton.setAttribute(
      "aria-label",
      collapsed ? "Expand music player" : "Minimize music player"
    );

    collapseIcon.textContent = collapsed ? "+" : "−";
    collapseButton.title = collapsed ? "Expand player" : "Minimize player";
  });

  audio.volume = Number(volume.value);

  renderPlaylist();
  loadTrack(0);
})();

/* SM Music Player — Smooth Desktop Pointer Effect */
(() => {
  const player = document.getElementById("smMusic");
  if (!player) return;

  const desktopPointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  if (!desktopPointer.matches) return;

  let frameId = 0;
  let targetX = 0;
  let targetY = 0;

  function handlePointerMove(event) {
    targetX = Math.max(
      -3,
      Math.min(3, (event.clientX / window.innerWidth - 0.5) * 6)
    );

    targetY = Math.max(
      -3,
      Math.min(3, (event.clientY / window.innerHeight - 0.5) * 6)
    );

    if (frameId) return;

    frameId = requestAnimationFrame(() => {
      player.style.setProperty("--sm-pointer-x", `${targetX}px`);
      player.style.setProperty("--sm-pointer-y", `${targetY}px`);
      frameId = 0;
    });
  }

  function resetPointer() {
    player.style.setProperty("--sm-pointer-x", "0px");
    player.style.setProperty("--sm-pointer-y", "0px");
  }

  document.addEventListener("pointermove", handlePointerMove, {
    passive: true
  });

  document.documentElement.addEventListener("pointerleave", resetPointer);
  window.addEventListener("blur", resetPointer);
})();