const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;
//setting model parameters
const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}
//function, which starts the video with detection
function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}
//button function, which allows to toggle video
function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}
//function, which states condition for detecting a hand
function runDetection() {
    model.detect(video).then(predictions => {
        console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
        if (predictions.length >= 1) {
            showNeeds();
            
        }
        requestAnimationFrame(runDetection);
    });
}
let plant = document.getElementById("plant");
let wateringCan = document.getElementById("can");
// function which allows the image to change
function showNeeds() {
    if (plant) {
        let displayPlant = plant.style.display;
        if (displayPlant == "inline") {
            plant.style.display = "none";
        } else {
            plant.style.display = "inline"
        }
        
    };
    if (wateringCan) {
        let displayCan = can.style.display;
        if (displayCan == "none") {
            can.style.display = "inline";
        } else {
            can.style.display = "none"
        }
        
    };
    
}

/* function showNeeds() {
    let plant = document.getElementsByClassName("plant");
    let wateringCan = document.getElementsByClassName("can");
    if (plant) {
        let displayPlant = plant.style.display;
        if (displayPlant == "inline") {
            plant.style.display = "none";
        } else {
            plant.style.display = "inline"
        }
    };
    if (wateringCan) {
        let displayCan = can.style.display;
        if (displayCan == "none") {
            can.style.display = "inline";
        } else {
            can.style.display = "inline"
        }
    }
    
}*/

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    trackButton.disabled = false
});
