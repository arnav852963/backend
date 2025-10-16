

# VideoTube Backend
A comprehensive backend for a video-sharing platform similar to YouTube, built with Node.js, Express, and MongoDB.

## 📋 Table of Contents
- Overview
- Features
- Installation
- Environment Variables
- API Endpoints
- Technologies Used
- Security Measures
- Future Improvements
## 🔍 Overview
VideoTube is a robust backend system designed to power a video-sharing platform. It provides all the necessary APIs for user management, video uploads, social interactions, and content organization.

## ✨ Features
- User Management : Registration, authentication, profile management
- Video Management : Upload, view, update, and delete videos
- Social Interactions : Comments, likes on videos and comments
- Content Organization : Create and manage playlists
- Creator Features : Channel subscriptions, analytics dashboard
- Social Engagement : Tweet functionality for creators
- Security : JWT-based authentication, password hashing
- File Handling : Video and image upload with Cloudinary integration
- Rate Limiting : Global rate limiting middleware with stricter limits for authentication routes

## Installation
# Clone the repository
git clone https://github.com/arnav852963/backend.git

# Navigate to the project directory
cd videotube-backend

# Install dependencies
npm install

# Start the development server
npm run dev

## Environment Variables
### 🛠️ Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=Your_name
CORS_ORIGIN=http://localhost:Your_port_no
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 📡 API Endpoints
### User Routes
- POST /api/v1/user/register : Register a new user
- POST /api/v1/user/login : User login
- POST /api/v1/user/logout : User logout
- GET /api/v1/user/refresh-token : Refresh access token
- GET /api/v1/user/current-user : Get current user details
- PATCH /api/v1/user/update-account : Update user account
- PATCH /api/v1/user/change-password : Change user password
- PATCH /api/v1/user/update-avatar : Update user avatar
- PATCH /api/v1/user/update-cover-image : Update user cover image
### Video Routes
- POST /api/v1/video/upload : Upload a new video
- GET /api/v1/video/:videoId : Get video by ID
- GET /api/v1/video/get-all : Get all videos
- PATCH /api/v1/video/update/:videoId : Update video details
- DELETE /api/v1/video/delete/:videoId : Delete a video
- GET /api/v1/video/get-by-user/:userId : Get videos by user
### Comment Routes
- POST /api/v1/comment/add/:videoId : Add a comment to a video
- GET /api/v1/comment/get/:videoId : Get comments for a video
- PATCH /api/v1/comment/update/:commentId : Update a comment
- DELETE /api/v1/comment/delete/:commentId : Delete a comment
### Like Routes
- POST /api/v1/like/toggle/video/:videoId : Toggle like on a video
- POST /api/v1/like/toggle/comment/:commentId : Toggle like on a comment
- GET /api/v1/like/videos : Get liked videos
- GET /api/v1/like/comments : Get liked comments
### Playlist Routes
- POST /api/v1/playlist/create : Create a new playlist
- GET /api/v1/playlist/user/:userId : Get user playlists
- GET /api/v1/playlist/:playlistId : Get playlist by ID
- PATCH /api/v1/playlist/update/:playlistId : Update playlist
- DELETE /api/v1/playlist/delete/:playlistId : Delete playlist
- POST /api/v1/playlist/add/:playlistId/:videoId : Add video to playlist
- DELETE /api/v1/playlist/remove/:playlistId/:videoId : Remove video from playlist
### Subscription Routes
- POST /api/v1/subscriptions/toggle/:channelId : Toggle subscription to a channel
- GET /api/v1/subscriptions/subscribers/:channelId : Get channel subscribers
- GET /api/v1/subscriptions/subscribed-to : Get subscribed channels
### Tweet Routes
- POST /api/v1/tweets/create : Create a new tweet
- GET /api/v1/tweets/user/:userId : Get user tweets
- PATCH /api/v1/tweets/update/:tweetId : Update a tweet
- DELETE /api/v1/tweets/delete/:tweetId : Delete a tweet
### Dashboard Routes
- GET /api/v1/dashboard/stats : Get creator dashboard statistics
### Health Check
- GET /api/v1/healthcheck : Check API health

  ## 🛠️ Technologies Used
- Node.js : JavaScript runtime
- Express : Web framework
- MongoDB : NoSQL database
- Mongoose : MongoDB object modeling
- JWT : Authentication and authorization
- Bcrypt : Password hashing
- Multer : File upload handling
- Cloudinary : Cloud storage for videos and images
- Cors : Cross-Origin Resource Sharing
- Dotenv : Environment variable management
## 🔒 Security Measures
- JWT Authentication : Secure access and refresh tokens
- Password Hashing : Bcrypt for secure password storage
- Rate Limiting : Global rate limiting middleware with stricter limits for authentication routes
- Input Validation : Thorough validation of user inputs
- Error Handling : Custom error handling for secure error responses
- CORS Configuration : Restricted cross-origin resource sharing
## 🚧 Future Improvements
- Implement email verification
- Add OAuth authentication options
- Enhance video processing with transcoding
- Implement real-time notifications using WebSockets
- Implement content recommendation system
