// public/scripts.js
document.getElementById('downloadForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const url = document.getElementById('videoURL').value;
  const message = document.getElementById('message');
  const progressBar = document.getElementById('progressBar');

  message.textContent = '';
  progressBar.value = 0;
  progressBar.style.display = 'block';

  fetch(`/download?url=${encodeURIComponent(url)}`)
    .then(response => {
      if (!response.ok) throw new Error('Download failed');

      const contentLength = response.headers.get('Content-Length');
      if (!contentLength) throw new Error('Cannot determine file size');

      const total = parseInt(contentLength, 10);
      let loaded = 0;
      const reader = response.body.getReader();
      const chunks = [];

      function pump() {
        return reader.read().then(({ done, value }) => {
          if (done) {
            const blob = new Blob(chunks);
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'video.mp4';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);

            message.textContent = 'Download complete';
            progressBar.style.display = 'none';
            return;
          }

          chunks.push(value);
          loaded += value.length;
          progressBar.value = (loaded / total) * 100;
          return pump();
        });
      }

      return pump();
    })
    .catch(err => {
      message.textContent = 'Error: ' + err.message;
      progressBar.style.display = 'none';
    });
});
