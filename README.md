## Instructions for running TruFans Video Clipper Locally

1. Clone the repository into your local machine
2.  After cloning, cd into the directory of the project
3.  Make sure you have NPM and Node installed
4.  Run npm install to install package dependencies
5.  npm run dev to run the website in Localhost:3000

--- 
### Usage
* You can upload videos locally or load videos from an external URL
* Currently, only HTTP hosted videos can be used, as FFMPEG needs to be recompiled (TODO in v2)
* If you click trim and the video still does not show, please wait a bit

---
### Please note the following:
* Videos will be outputted as mp4 (custom formatting in v2)
* Videos will be processed in your local machine, and deleted when you quit the web app
* If you run into error 4094, delete the .next folder in the root directory of the project and try again
