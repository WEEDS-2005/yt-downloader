# Use the official Node.js image
FROM node:14

# Install yt-dlp
RUN apt-get update && apt-get install -y python3-pip && pip3 install yt-dlp

# Set up the working directory
WORKDIR /usr/src/app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port that your app will run on
EXPOSE 3000

# Start the Node.js app
CMD ["npm", "start"]
