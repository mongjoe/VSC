const musicContainer = document.querySelector(".music-container");
const audio = document.querySelector("audio");
const trackArt = document.querySelector(".track-art");
const musicInfo = document.querySelector(".music-info");
const trackName = document.querySelector(".track-name");
const trackArtist = document.querySelector(".track-artist");
const timelineContainer = document.querySelector(".timeline-container");
const btnContainer = document.querySelector(".button-container");
const shuffleBtn = document.querySelector(".shuffle-btn");
const prevBtn = document.querySelector(".prev-btn");
const playPauseBtn = document.querySelector(".play-pause-btn");
const nextBtn = document.querySelector(".next-btn");
const muteBtn = document.querySelector(".mute-btn");
const volumeSlider = document.querySelector(".volume-slider");
const currentTime = document.querySelector(".current-time");
const totalTime = document.querySelector(".total-time");
// let wave = document.getElementById("wave");
let trackIndex = 0;
let isPlaying = false;
let isRandom = false;

const music_list = [
  {
    img: "https://images2.thanhnien.vn/Uploaded/nguyenvan/2022_09_28/298829995-681900229966021-4864735301385035508-n-8447.jpg",
    name: "Thấy Chưa",
    artist: "Ngọt",
    music: "./music/Ngọt - Thấy Chưa.mp3",
  },
  {
    img: "https://cdn-p.smehost.net/sites/7f9737f2506941499994d771a29ad47a/wp-content/uploads/2022/05/Polyphia.jpg",
    name: "Playing God",
    artist: "Polyphia",
    music: "./music/Playing God-Polyphia.mp3",
  },
  {
    img: "https://avatar-ex-swe.nixcdn.com/song/2023/02/10/1/1/b/f/1676004847611_640.jpg",
    name: "Là Anh (是你)",
    artist: "Mộng Nhiên",
    music: "./music/Là-Anh-_是你___Mộng-Nhiên__lossless.mp3",
  },
  {
    img: "https://irishheritagefestival.com/wp-content/uploads/2019/06/image5-16.jpg",
    name: "Comethru",
    artist: "Jeremy Zucker",
    music: "./music/Comethru-Jeremy-Zucker.mp3",
  },
  {
    img: "https://i.ytimg.com/vi/3an192aq0wQ/maxresdefault.jpg",
    name: "Cảm Ơn",
    artist: "Đen Vâu",
    music: "./music/Cảm-Ơn.mp3",
  },
];
loadTrack(trackIndex);

function loadTrack(trackIndex) {
  reset();

  audio.src = music_list[trackIndex].music;
  audio.load();

  trackArt.style.backgroundImage = "url(" + music_list[trackIndex].img + ")";
  trackName.textContent = music_list[trackIndex].name;
  trackArtist.textContent = music_list[trackIndex].artist;

  audio.addEventListener("ended", nextTrack);
  random_bg_color();
}

function random_bg_color() {
  let hex = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
  ];
  let a;

  function populate(a) {
    for (let i = 0; i < 6; i++) {
      let x = Math.round(Math.random() * 14);
      let y = hex[x];
      a += y;
    }
    return a;
  }
  let Color1 = populate("#");
  let Color2 = populate("#");
  var angle = "to bottom right";

  let gradient =
    "linear-gradient(" + angle + "," + Color1 + ", " + Color2 + ")";
  document.body.style.background = gradient;
  volumeSlider.style.setProperty("--background", Color2);
  timelineContainer.style.setProperty("--background", Color2);
  musicInfo.style.setProperty("--background", gradient);
}
function reset() {
  currentTime.textContent = "00:00";
  totalTime.textContent = "00:00";
}

//Timeline

//Nếu chuột đang di chuyển bắt đầu handleTimelineUpdate
timelineContainer.addEventListener("mousemove", handleTimelineUpdate);

//Nếu chuột được nhấn xuống, chuyển đổi
timelineContainer.addEventListener("mousedown", togglePlay);

//Only enter scrubbing when in timeline and clicking down
document.addEventListener("mouseup", (e) => {
  if (isScrubbing) toggleScrubbing(e);
});

//If scrubbing starts handleTimelineUpdate
document.addEventListener("mousemove", (e) => {
  if (isScrubbing) handleTimelineUpdate(e);
});

let isScrubbing = false;
let wasPaused;
function toggleScrubbing(e) {
  const rect = timelineContainer.getBoundingClientRect();

  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
  //Determines if left button is being click, if yes, enables scrubbing
  isScrubbing = (e.buttons & 1) === 1;
  musicContainer.classList.toggle("scrubbing", isScrubbing);
  //If scrubbing, pause audio
  if (isScrubbing) {
    wasPaused = audio.paused;
    audio.pause();
  } else {
    //Move audio where scrubbing was stopped then play
    audio.currentTime = percent * audio.duration;
    if (!wasPaused) audio.play();
  }

  //If scrubbing starts, pulls code from handleTimelineUpdate
  handleTimelineUpdate(e);
}

function handleTimelineUpdate(e) {
  const rect = timelineContainer.getBoundingClientRect();

  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
  //Math.floor((percent * audio.duration)) gives value for how far into audio
  //Determines image according to how they were set up, 10 seconds
  timelineContainer.style.setProperty("--preview-position", percent);

  //Scrubbing Settings
  if (isScrubbing) {
    //Prevents highlighting page while scrubbing
    e.preventDefault();
    timelineContainer.style.setProperty("--progress-position", percent);
  }
}

//Current Time
audio.addEventListener("timeupdate", () => {
  currentTime.textContent = formatDuration(audio.currentTime);
  //Bar will move with audio progress
  const percent = audio.currentTime / audio.duration;
  timelineContainer.style.setProperty("--progress-position", percent);
});

//Duration Counter
audio.addEventListener("loadeddata", () => {
  totalTime.textContent = formatDuration(audio.duration);
});

//Makes time say :04 instead of :4
const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});

//Created to display duration time in full instead of seconds
function formatDuration(time) {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);
  //If no hours display minutes, if so show with minutes
  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`;
  }
}

//Play/Pause button toggle
playPauseBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", togglePlay);

/*Play/Pause*/
function togglePlay() {
  audio.paused ? audio.play() : audio.pause();
}

//Add paused class on paused and remove on play
audio.addEventListener("play", () => {
  musicContainer.classList.remove("paused");
});

audio.addEventListener("pause", () => {
  musicContainer.classList.add("paused");
});

/*Next Track*/
function nextTrack() {
  if (trackIndex < music_list.length - 1 && isRandom === false) {
    trackIndex += 1;
  } else if (trackIndex < music_list.length - 1 && isRandom === true) {
    let random_index = Number.parseInt(Math.random() * music_list.length);
    trackIndex = random_index;
  } else {
    trackIndex = 0;
  }
  loadTrack(trackIndex);
  playTrack();
}

/*Prev Track*/
function prevTrack() {
  if (trackIndex > 0) {
    trackIndex -= 1;
  } else {
    trackIndex = music_list.length - 1;
  }
  loadTrack(trackIndex);
  playTrack();
}

/*Repeat Track*/
function repeatTrack() {
  let current_index = trackIndex;
  loadTrack(current_index);
  playTrack();
}

//Mute toggle
muteBtn.addEventListener("click", toggleMute);

function toggleMute() {
  audio.muted = !audio.muted;
}

//Set volume slider to corresponding value
volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;
  audio.muted = e.target.value === 0;
});

//Change volume button according to actual volume
audio.addEventListener("volumechange", () => {
  volumeSlider.value = audio.volume / 1;
  let volumeLevel;
  if (audio.muted || audio.volume === 0) {
    volumeSlider.value = 0;
    volumeLevel = "muted";
  } else if (audio.volume >= 0.6) {
    volumeLevel = "high";
  } else {
    volumeLevel = "low";
  }

  //Volume button will correlate with volume level
  musicContainer.dataset.volumeLevel = volumeLevel;

  //Inside volume bar will move with volume level
  volumeSlider.style.setProperty("--volume-level", volumeSlider.value);
});
