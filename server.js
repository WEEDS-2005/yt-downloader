// server.js
const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle video download requests
app.get('/download', (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send('No URL provided');

  const fileName = `video_${Date.now()}.mp4`;
  const filePath = path.join(__dirname, 'downloads', fileName);

  const command = `yt-dlp -f bestvideo+bestaudio --merge-output-format mp4 -o "${filePath}" ${videoUrl}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      return res.status(500).send('Error downloading video');
    }

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      fs.unlink(filePath, () => {}); // Clean up after sending
    });
  });
});

if (!fs.existsSync(path.join(__dirname, 'downloads')))
  fs.mkdirSync(path.join(__dirname, 'downloads'));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

