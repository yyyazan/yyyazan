// Array of sound file paths corresponding to the keys
const sounds = {
    c3: "sounds/c3.mp3",
    db3: "sounds/db3.mp3",
    d3: "sounds/d3.mp3",
    eb3: "sounds/eb3.mp3",
    e3: "sounds/e3.mp3",
    f3: "sounds/f3.mp3",
    gb3: "sounds/gb3.mp3",
    g3: "sounds/g3.mp3",
    ab3: "sounds/ab3.mp3",
    a3: "sounds/a3.mp3",
    bb3: "sounds/bb3.mp3",
    b3: "sounds/b3.mp3",
    c4: "sounds/c4.mp3",
    db4: "sounds/db4.mp3",
    d4: "sounds/d4.mp3",
    eb4: "sounds/eb4.mp3",
    e4: "sounds/e4.mp3",
    f4: "sounds/f4.mp3",
    gb4: "sounds/gb4.mp3",
    g4: "sounds/g4.mp3",
    ab4: "sounds/ab4.mp3",
    a4: "sounds/a4.mp3",
    bb4: "sounds/bb4.mp3",
    b4: "sounds/b4.mp3",
    c5: "sounds/c5.mp3"
};


// Function to preload a silent sound
function preloadSilentSound() {
    const silentAudio = new Audio("sounds/silent.mp3");
    silentAudio.play().catch((error) => {
        console.log("Silent sound preload prevented by browser policy, proceeding without preload.");
    });
}

// Preload the silent sound when the page loads
window.addEventListener("load", preloadSilentSound);

// Add event listeners for keys
document.querySelectorAll(".key").forEach((key) => {
    key.addEventListener("click", () => {
        const note = key.dataset.sound; // Get the note name from data-sound attribute
        playSoundWithTimeout(note, 4000); // Play sound and stop after 4 seconds
    });
});

// Function to play sound
function playSoundWithTimeout(note, duration) {
    const soundFile = sounds[note];
    if (!soundFile) {
        console.error(`Sound for note "${note}" not found.`);
        return;
    }

    const audio = new Audio(soundFile);
    audio.play();

    // Stop the audio after the specified duration
    setTimeout(() => {
        audio.pause();
        audio.currentTime = 0; // Reset playback position
    }, duration);
}
