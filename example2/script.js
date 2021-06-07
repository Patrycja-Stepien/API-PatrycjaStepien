//GETTING USER MEDIA DEPPENDING ON THE BROWSER - Chrome, Internet Explorer, Firefox

navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

//GETTING HTML ID AS CONSTANT - VIDEO STREAM, CANVAS, AUDIO
const  video = document.querySelector('#video'),
       canvas = document.querySelector('#canvas'),
       handCount = document.querySelector('#handCount'),
       context = canvas.getContext('2d');

//Show CL to the Users
var confidenceLevelShow = document.querySelector('#confidenceLevelShow'),
    confidenceLevel = document.querySelector('#confidenceLevel');

//INITIALIZE MODEL FOR HAND DETECTION
let model;

handTrack.startVideo(video).then(status => {
     if(status){
       navigator.getUserMedia(
         { video: {} },
         stream => {
           video.srcObject = stream;
           setInterval (runDetection, 0);
         },
         err => console.log(err)
      );
    }
});

//Getting predictions and rendering in the canvas as output
function runDetection(){
  model.detect(video).then(predictions => {
    handCount.innerHTML = predictions.length;
    model.renderPredictions(predictions, canvas, context, video);
  })
};


//CREATING modelParams TO PASS TO load()
let modelParams = {
  flipHorizontal: true,   // flip e.g for video
  imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
  maxNumBoxes: 20,        // maximum number of boxes to detect
  iouThreshold: 0.5,      // ioU threshold for non-max suppression
  scoreThreshold: 0.90,    // confidence threshold for predictions.
}

confidenceLevel.value = modelParams.scoreThreshold * 100;

function updateConfidenceLevelView() {
  confidenceLevelShow.innerHTML = modelParams.scoreThreshold * 100;
}

updateConfidenceLevelView();


function changeScoreThreshold(value) {
    modelParams.scoreThreshold = value/100;
    //LOAD THE MODEL FROM HANDTRACK.JS
    callHandTrackLoad();
    updateConfidenceLevelView();
}

function changeIOU(value) {
    modelParams.iouThreshold = value/100;
    //LOAD THE MODEL FROM HANDTRACK.JS
    callHandTrackLoad();
}

function changeImageScaleFactor(value) {
    modelParams.imageScaleFactor = value/100;
    //LOAD THE MODEL FROM HANDTRACK.JS
    callHandTrackLoad();
}

//LOAD THE MODEL FROM HANDTRACK.JS
function callHandTrackLoad(){
  handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
  })
}

callHandTrackLoad();
