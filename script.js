document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');
    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('artist-name');
    const albumArt = document.getElementById('album-art');
    const queueList = document.getElementById('queue-list');
    
    // Music library
    const songs = [
        {
            title: "Blinding Lights",
            artist: "The Weeknd",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            cover: "1716704619418.jpg",
            duration: "3:20"
        },
        {
            title: "Save Your Tears",
            artist: "The Weeknd",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            cover: "61f4db36cb20f1790ef25935fb567021~tplv-tiktokx-cropcenter_100_100.JPEG",
            duration: "3:35"
        },
        {
            title: "Levitating",
            artist: "Dua Lipa",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            cover: "pic 3.JPEG",
            duration: "3:23"
        },
        {
            title: "Stay",
            artist: "The Kid LAROI, Justin Bieber",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            cover: "Pic 4.JPEG",
            duration: "2:21"
        },
        {
            title: "Good 4 U",
            artist: "Olivia Rodrigo",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
            cover: "61f4db36cb20f1790ef25935fb567021~tplv-tiktokx-cropcenter_100_100.JPEG",
            duration: "2:58"
        }
    ];
    
    // Player state
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffled = false;
    let isRepeated = false;
    let originalQueue = [...songs];
    let shuffledQueue = [...songs].sort(() => Math.random() - 0.5);
    
    // Initialize player
    function initPlayer() {
        loadSong(currentSongIndex);
        renderQueue();
        updatePlayerState();
    }
    
    // Load song
    function loadSong(index) {
        const song = isShuffled ? shuffledQueue[index] : originalQueue[index];
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        albumArt.src = song.cover;
        audioPlayer.src = song.src;
        durationEl.textContent = song.duration;
        
        // Add active class to current song in queue
        const queueItems = document.querySelectorAll('.queue-item');
        queueItems.forEach(item => item.classList.remove('active'));
        if (queueItems[index]) {
            queueItems[index].classList.add('active');
        }
    }
    
    // Play song
    function playSong() {
        isPlaying = true;
        audioPlayer.play();
        playIcon.classList.replace('fa-play', 'fa-pause');
        document.querySelector('.player-container').classList.add('playing');
        updatePlayerState();
    }
    
    // Pause song
    function pauseSong() {
        isPlaying = false;
        audioPlayer.pause();
        playIcon.classList.replace('fa-pause', 'fa-play');
        document.querySelector('.player-container').classList.remove('playing');
        updatePlayerState();
    }
    
    // Previous song
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = (isShuffled ? shuffledQueue : originalQueue).length - 1;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }
    
    // Next song
    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex >= (isShuffled ? shuffledQueue : originalQueue).length) {
            if (isRepeated) {
                currentSongIndex = 0;
            } else {
                currentSongIndex--;
                pauseSong();
                return;
            }
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }
    
    // Update progress bar
    function updateProgress() {
        const { currentTime, duration } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.setProperty('--progress', `${progressPercent}%`);
        
        // Format time
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };
        
        currentTimeEl.textContent = formatTime(currentTime);
        
        // Auto-play next song when current ends
        if (currentTime >= duration - 0.5 && duration > 0) {
            nextSong();
        }
    }
    
    // Set progress
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    }
    
    // Set volume
    function setVolume() {
        audioPlayer.volume = this.value;
    }
    
    // Toggle shuffle
    function toggleShuffle() {
        isShuffled = !isShuffled;
        shuffleBtn.classList.toggle('active', isShuffled);
        
        if (isShuffled) {
            // Find current song in shuffled queue
            const currentSong = originalQueue[currentSongIndex];
            currentSongIndex = shuffledQueue.findIndex(song => song.title === currentSong.title);
        } else {
            // Find current song in original queue
            const currentSong = shuffledQueue[currentSongIndex];
            currentSongIndex = originalQueue.findIndex(song => song.title === currentSong.title);
        }
        
        updatePlayerState();
    }
    
    // Toggle repeat
    function toggleRepeat() {
        isRepeated = !isRepeated;
        repeatBtn.classList.toggle('active', isRepeated);
        updatePlayerState();
    }
    
    // Render queue
    function renderQueue() {
        queueList.innerHTML = '';
        const queue = isShuffled ? shuffledQueue : originalQueue;
        
        queue.forEach((song, index) => {
            const queueItem = document.createElement('div');
            queueItem.className = `queue-item ${index === currentSongIndex ? 'active' : ''}`;
            queueItem.innerHTML = `
                <div class="queue-item-img">
                    <img src="${song.cover}" alt="${song.title}">
                </div>
                <div class="queue-item-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                <div class="queue-item-duration">${song.duration}</div>
            `;
            
            queueItem.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                if (isPlaying) {
                    playSong();
                }
            });
            
            queueList.appendChild(queueItem);
        });
    }
    
    // Update player state (for UI feedback)
    function updatePlayerState() {
        // Update active song in queue
        const queueItems = document.querySelectorAll('.queue-item');
        queueItems.forEach((item, index) => {
            item.classList.toggle('active', index === currentSongIndex);
        });
        
        // Update button states
        shuffleBtn.classList.toggle('active', isShuffled);
        repeatBtn.classList.toggle('active', isRepeated);
    }
    
    // Event listeners
    playBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });
    
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
    
    progressBar.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', setVolume);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                isPlaying ? pauseSong() : playSong();
                break;
            case 'ArrowLeft':
                audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 5);
                break;
            case 'ArrowRight':
                audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 5);
                break;
            case 'ArrowUp':
                volumeSlider.value = Math.min(1, parseFloat(volumeSlider.value) + 0.1);
                setVolume.call(volumeSlider);
                break;
            case 'ArrowDown':
                volumeSlider.value = Math.max(0, parseFloat(volumeSlider.value) - 0.1);
                setVolume.call(volumeSlider);
                break;
        }
    });
    
    // Initialize the player
    initPlayer();
    
    // Add animation to album art on load
    albumArt.addEventListener('load', function() {
        this.style.opacity = 1;
    });
});