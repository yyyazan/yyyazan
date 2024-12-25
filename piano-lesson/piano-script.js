// Array of sound file paths corresponding to the keys
const sounds = {
    c3: "piano-lesson/sounds/c3.mp3",
    db3: "piano-lesson/sounds/db3.mp3",
    d3: "piano-lesson/sounds/d3.mp3",
    eb3: "piano-lesson/sounds/eb3.mp3",
    e3: "piano-lesson/sounds/e3.mp3",
    f3: "piano-lesson/sounds/f3.mp3",
    gb3: "piano-lesson/sounds/gb3.mp3",
    g3: "piano-lesson/sounds/g3.mp3",
    ab3: "piano-lesson/sounds/ab3.mp3",
    a3: "piano-lesson/sounds/a3.mp3",
    bb3: "piano-lesson/sounds/bb3.mp3",
    b3: "piano-lesson/sounds/b3.mp3",
    c4: "piano-lesson/sounds/c4.mp3",
    db4: "piano-lesson/sounds/db4.mp3",
    d4: "piano-lesson/sounds/d4.mp3",
    eb4: "piano-lesson/sounds/eb4.mp3",
    e4: "piano-lesson/sounds/e4.mp3",
    f4: "piano-lesson/sounds/f4.mp3",
    gb4: "piano-lesson/sounds/gb4.mp3",
    g4: "piano-lesson/sounds/g4.mp3",
    ab4: "piano-lesson/sounds/ab4.mp3",
    a4: "piano-lesson/sounds/a4.mp3",
    bb4: "piano-lesson/sounds/bb4.mp3",
    b4: "piano-lesson/sounds/b4.mp3",
    c5: "piano-lesson/sounds/c5.mp3"
};

// Function to preload a silent sound
function preloadSilentSound() {
    const silentAudio = new Audio("piano-lesson/sounds/silent.mp3");
    silentAudio.play().catch((error) => {
        console.log("Silent sound preload prevented by browser policy, proceeding without preload.");
    });
}

// Preload the silent sound when the page loads
window.addEventListener("load", preloadSilentSound);

// Variable to prevent duplicate event handling
let touchHandled = false;

// Add event listeners for keys
document.querySelectorAll(".key").forEach((key) => {
    const playHandler = () => {
        const note = key.dataset.sound; // Get the note name from data-sound attribute
        playSoundWithTimeout(note, 4000); // Play sound and stop after 4 seconds
    };

    // Handle touchstart event
    key.addEventListener("touchstart", (event) => {
        touchHandled = true; // Mark the touch as handled
        event.preventDefault(); // Prevent the click event from firing
        key.classList.add('active'); // Add the active class to change background
        playHandler();
    });

    // Handle touchend event
    key.addEventListener("touchend", () => {
        key.classList.remove('active'); // Remove the active class when touch ends
    });

    // Handle click event
    key.addEventListener("click", () => {
        if (!touchHandled) {
            playHandler();
        }
        touchHandled = false; // Reset the flag after the click event
    });
});

// Function to play sound and stop it after a timeout
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
