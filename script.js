'use strict';

let mediaRecorder;
let recordedChunks = [];

const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');
const recordedVideo = document.getElementById('recordedVideo');

startRecordingButton.addEventListener('click', startRecording);
stopRecordingButton.addEventListener('click', stopRecording);

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { mediaSource: 'screen' }
    });

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      recordedChunks = [];

      const url = URL.createObjectURL(blob);
      recordedVideo.src = url;
      recordedVideo.style.display = 'block';

      startRecordingButton.disabled = true;
      stopRecordingButton.disabled = false;

      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'recorded-video.webm';
      document.body.appendChild(downloadLink);

      // Trigger the download
      downloadLink.click();

      // Remove the download link
      document.body.removeChild(downloadLink);
    };

    mediaRecorder.start();
  } catch (error) {
    console.error('Error starting recording:', error);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }

  startRecordingButton.disabled = false;
  stopRecordingButton.disabled = true;
}