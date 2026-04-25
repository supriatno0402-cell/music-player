const playerBox = document.querySelector(".player");



let audioContext;
let analyser;
let source;
let dataArray;



const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const title = document.getElementById("title");

const progress = document.getElementById("progress");

// PLAYLIST
const songs = [
  {
    title: "scorpions-still-loving-you",
    src: "assets/lagu1.mp3",
   
  },
  {
    title: "scorpions-dynamite",
    src: "assets/lagu2.mp3",
   
  },
  {
    title: "scorpions-lady-starlight",
    src: "assets/lagu3.mp3",
    
  },
  
    {
    title: "scorpions-spedy's-coming",
    src: "assets/lagu4.mp3",
   
  },
  
    {
    title: "scorpions-you-and-i",
    src: "assets/lagu5.mp3",
   
  },
  
    {
    title: "scorpions-women",
    src: "assets/lagu6.mp3",
   
  },
  
    {
    title: "scorpions-coming-home",
    src: "assets/lagu7.mp3",
   
  },
  
    {
    title: "scorpions-yellow-raven",
    src: "assets/lagu8.mp3",
   
  },
  
    {
    title: "scorpions-walking-on-edge",
    src: "assets/lagu9.mp3",
   
  },
  
    {
    title: "scorpions-fly-people-ply",
    src: "assets/lagu10.mp3",
   
  },
  
    {
    title: "scorpions-when-you-came-into-mylife",
    src: "assets/lagu11.mp3",
   
  },
];
 
  

const playlistContainer = document.getElementById("playlist");

// render playlist
function renderPlaylist() {
  playlistContainer.innerHTML = "";

  songs.forEach((song, i) => {
    const item = document.createElement("div");
    item.classList.add("playlist-item");
    item.textContent = song.title;

    item.addEventListener("click", () => {
      index = i;
      loadSong(index);
      playSong();
    });

    playlistContainer.appendChild(item);
  });
}

renderPlaylist();
let index = 0;
let isPlaying = false;



// LOAD SONG

function loadSong(i) {
  const song = songs[i];
  title.textContent = song.title;
  audio.src = song.src;

  // highlight aktif
  const items = document.querySelectorAll(".playlist-item");
  items.forEach((el, idx) => {
    el.classList.toggle("active", idx === i);
  });
}

function playSong() {
  audio.play()
    .then(() => {
      console.log("Audio jalan");

      isPlaying = true;
      playBtn.textContent = "⏸";

      // 🔥 aktifkan neon
      playerBox.classList.add("active");
    })
    .catch(err => {
      console.log("Error play:", err);
    });
}

function playSong() {
  audio.play()
    .then(() => {
      console.log("Audio jalan");

      isPlaying = true;
      playBtn.textContent = "⏸";

      // 🔥 aktifkan neon
      playerBox.classList.add("active");
    })
    .catch(err => {
      console.log("Error play:", err);
    });
}

function playSong() {

  // setup audio context (sekali saja)
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    source = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }

  audio.play().then(() => {
    console.log("Audio jalan");

    isPlaying = true;
    playBtn.textContent = "⏸";

    // 🔥 neon ON
    playerBox.classList.add("active");

    // 🔥 equalizer ON
    animateEqualizer();
  }).catch(err => {
    console.log("Error play:", err);
  });
}
// PAUSE
function pauseSong() {
  audio.pause();

  isPlaying = false;
  playBtn.textContent = "▶";

  // ❌ matikan neon
  playerBox.classList.remove("active");
}


// TOGGLE PLAY
playBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// NEXT
function nextSong() {
  index++;
  if (index >= songs.length) index = 0;
  loadSong(index);
  playSong();
}

// PREV
function prevSong() {
  index--;
  if (index < 0) index = songs.length - 1;
  loadSong(index);
  playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// AUTO NEXT KALAU LAGU HABIS
audio.addEventListener("ended", nextSong);

// PROGRESS UPDATE
audio.addEventListener("timeupdate", () => {
  const { duration, currentTime } = audio;
  if (duration) {
    progress.value = (currentTime / duration) * 100;
  }
});

// SEEK (GESER LAGU)
progress.addEventListener("input", () => {
  const duration = audio.duration;
  audio.currentTime = (progress.value / 100) * duration;
});

// LOAD PERTAMA
loadSong(index);

const volume = document.getElementById("volume");

// set volume awal
audio.volume = 1;

// control volume
volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

const bars = document.querySelectorAll("#equalizer span");

audio.addEventListener("ended", () => {
  bars.forEach(bar => {
    bar.style.animationPlayState = "paused";
  });
});

function animateEqualizer() {
  const bars = document.querySelectorAll("#equalizer span");
function animateEqualizer() {
  const bars = document.querySelectorAll("#equalizer span");

  function update() {
    if (!analyser) return;

    analyser.getByteFrequencyData(dataArray);

    bars.forEach((bar, i) => {
      const value = dataArray[i] || 0;
      const height = (value / 155) * 10+ 5;
      bar.style.height = height + "px";
    });

    requestAnimationFrame(update);
  }

  update();
}

  function update() {
    if (!isPlaying) return;

    analyser.getByteFrequencyData(dataArray);

    bars.forEach((bar, i) => {
      const value = dataArray[i] || 0;
      const height = (value / 255) * 40 + 5; // tinggi max 40px
      bar.style.height = height + "px";
    });

    requestAnimationFrame(update);
  }

  update();
}
audio.addEventListener("ended", () => {
  playerBox.classList.remove("active");
  nextSong();
});

audio.addEventListener("timeupdate", () => {
  const { duration, currentTime } = audio;

  if (duration) {
    const percent = (currentTime / duration) * 100;
    progress.value = percent;

    // warna isi
    progress.style.background = `linear-gradient(to right, #b400ff ${percent}%, rgba(255,255,255,0.2) ${percent}%)`;
  }
});

function updateSliderBackground(slider) {
  const value = slider.value;
  const max = slider.max || 100;
  const percent = (value / max) * 100;

  slider.style.background = `
    linear-gradient(
      to right,
      #ff00cc,
      #b400ff ${percent}%,
      rgba(255,255,255,0.15) ${percent}%
      
      slider.style.boxShadow=
      0 0 $(5 +percent/8)px rgba(180.0.255.0.5)
    )
  `;

  // glow ikut posisi
  slider.style.boxShadow = `0 0 ${5 + percent/5}px rgba(180,0,255,0.6)`;
}

function createRipple(e) {
  const target = e.currentTarget;

  const circle = document.createElement("span");
  circle.classList.add("ripple");

  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);

  circle.style.width = circle.style.height = size + "px";
  circle.style.left = (e.clientX - rect.left - size / 2) + "px";
  circle.style.top = (e.clientY - rect.top - size / 2) + "px";

  target.appendChild(circle);

  setTimeout(() => {
    circle.remove();
  }, 600);
}


document.querySelectorAll('input[type="range"]').forEach(slider => {
  slider.addEventListener("pointerdown", createRipple);
});

document.querySelectorAll('input[type="range"]').forEach(slider => {
  slider.addEventListener("pointerdown", createRipple);
});