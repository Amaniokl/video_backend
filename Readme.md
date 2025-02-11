# Backend for video streaming platform
-Link for backend data model 
-[Model Link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

# CloudStream API

This project is a backend API for a video platform, built using Node.js, Express, and MongoDB. It provides various functionalities such as user authentication, video management, comments, likes, playlists, and subscriptions.
I have also used third party service cloudinary to store videos and photos.

## Table of Contents

- [File Structure](#file-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Video Routes](#video-routes)
  - [Comment Routes](#comment-routes)
  - [Like Routes](#like-routes)
  - [Playlist Routes](#playlist-routes)
  - [Subscription Routes](#subscription-routes)
  - [Tweet Routes](#tweet-routes)
- [Middleware](#middleware)
- [Models](#models)
- [Controllers](#controllers)
- [Routes](#routes)
- [License](#license)

## File Structure

```bash
video_backend/
├── src/
│   ├── app.js                   # Main application file
│   ├── constants.js             # Constants used throughout the application
│   ├── controllers/             # Controllers for handling business logic
│   │   ├── comment.controller.js
│   │   ├── like.controller.js
│   │   ├── playlist.controller.js
│   │   ├── subscription.controller.js
│   │   ├── tweet.controller.js
│   │   ├── user.controller.js
│   │   └── video.controller.js
│   ├── db/                      # Database connection setup
│   │   └── index.js
│   ├── middlewares/             # Middleware functions
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   ├── models/                  # Mongoose models
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── playlist.model.js
│   │   ├── subscription.model.js
│   │   ├── tweet.model.js
│   │   ├── user.model.js
│   │   └── video.model.js
│   ├── routes/                  # API routes
│   │   ├── comment.route.js
│   │   ├── like.route.js
│   │   ├── playlist.route.js
│   │   ├── subscription.route.js
│   │   ├── tweet.route.js
│   │   ├── user.routes.js
│   │   └── video.routes.js
│   ├── .env                     # Environment variables
│   ├── .prettierignore          # Prettier ignore file
│   └── .prettierrc              # Prettier configuration
├── package.json                 # Project metadata and dependencies
└── README.md                    # Project documentation
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/video_backend.git
   cd video_backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the necessary environment variables:
   ```
   MONGODB_URL=your_mongodb_url
   CORS_ORIGIN=your_cors_origin
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   PORT=8000
   CLOUDINARY_CLOUD_NAME=xyz
   CLOUDINARY_API_KEY=xyz
   CLOUDINARY_API_SECRET=xyz
   ```

## Usage

To start the server, run:
```bash
   npm start
   ```
The server will run on the specified port (default is 8000).

## API Endpoints

### User Routes
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Log in a user
- `POST /api/v1/users/logout` - Log out a user
- `GET /api/v1/users/current-user` - Get current user details
- `PATCH /api/v1/users/update-account` - Update user account details
- `PATCH /api/v1/users/update-avatar` - Update user avatar
- `PATCH /api/v1/users/update-cover-image` - Update user cover image

### Video Routes
- `POST /api/v1/video/video-upload` - Upload a new video
- `GET /api/v1/video/VideoId/:videoId` - Get video by ID
- `GET /api/v1/video/allVideos` - Get all videos
- `PATCH /api/v1/video/VideoId/:videoId` - Update video details
- `DELETE /api/v1/video/delete/:videoId` - Delete a video
- `POST /api/v1/video/tooglePublish/:videoId` - Toggle publish status of a video

### Comment Routes
- `GET /api/v1/comment/video/:videoId` - Get all comments for a video
- `POST /api/v1/comment/video/:videoId` - Add a comment to a video
- `PATCH /api/v1/comment/:commentId` - Update a specific comment
- `DELETE /api/v1/comment/:commentId` - Delete a specific comment

### Like Routes
- `POST /api/v1/like/video/:videoId` - Toggle like for a video
- `POST /api/v1/like/comment/:commentId` - Toggle like for a comment
- `POST /api/v1/like/tweet/:tweetId` - Toggle like for a tweet
- `GET /api/v1/like/videos` - Get all liked videos by the user

### Playlist Routes
- `POST /api/v1/playlist` - Create a new playlist
- `GET /api/v1/playlist/:playlistId` - Get a playlist by ID
- `PATCH /api/v1/playlist/:playlistId` - Update a playlist
- `DELETE /api/v1/playlist/:playlistId` - Delete a playlist
- `PATCH /api/v1/playlist/add/:videoId/:playlistId` - Add a video to a playlist
- `PATCH /api/v1/playlist/remove/:videoId/:playlistId` - Remove a video from a playlist
- `GET /api/v1/playlist/user/:userId` - Get all playlists for a user

### Subscription Routes
- `POST /api/v1/subscription/toggle/:channelId` - Toggle subscription to a channel
- `GET /api/v1/subscription/subscribers/:subscriberId` - Get subscriber list of a channel
- `GET /api/v1/subscription/subscribed/:channelId` - Get channels a user has subscribed to

### Tweet Routes
- `POST /api/v1/tweet/upload` - Upload a new tweet
- `DELETE /api/v1/tweet/delete/:tweetId` - Delete a tweet
- `GET /api/v1/tweet/getall/:userId` - Get all tweets of a user

## Middleware

- **auth.middleware.js**: Middleware for verifying JWT tokens and protecting routes.
- **multer.middleware.js**: Middleware for handling file uploads.

## Models

- **User**: Represents a user in the system.
- **Video**: Represents a video uploaded by a user.
- **Comment**: Represents comments made on videos.
- **Like**: Represents likes on videos, comments, and tweets.
- **Playlist**: Represents playlists created by users.
- **Subscription**: Represents subscriptions between users.

## Controllers

Controllers handle the business logic for each route. They interact with the models and return responses to the client.

## Routes

Routes define the API endpoints and map them to the corresponding controller functions.

