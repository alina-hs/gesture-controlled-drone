# Drone-commandor for tello drone
The Drone-commandor is a software package to control a tello drone with by gesture detected by handpose model from TensorFlow.js. Gestures include thumbs up for starting, thumbs down for landing, and victory for a backflip. Additionally, you can control the drone through a web interface and view information about battery, flying state and flight attitue.
![image](https://user-images.githubusercontent.com/18613510/130768871-84f6f641-54b5-4593-b922-55e86122370a.png)


## Installation
- execute `npm i` in the directories backend and frontend
- start frontend and backend with `npm start`
- open the app with http://localhost:3000
- make sure you are connected to the internet, that the app can load the hand pose model
- to control the drone make sure the device where the project is running on is connected with the WIFI of the drone

## Architecture
![Drone Architecture (2)](https://user-images.githubusercontent.com/18613510/130760587-59282b9b-54a0-493a-8c55-3a8897760750.jpg)
- The frontend detects hand gestures based on the video feed of the connected camera and the hand pose model from TensorFlow.js.
- With TensorFlow.js the hand detecting is done in the browser and not in the backend
- The tello drone offers an API to control the drone via text commands through a UDP socket connection.
- Drone commands initiated by the frontend are sent to the backend via a websocket and connection and will then be forwarded to the drone via the UDP socket connection.


## Improvement
Instead of gesture control the body segmentation model could be more reliable which is also available in TensorFlow.js.

## Potential use cases in education
- offer a drag and drop kit for building a sequence of flying controls
  - User can fly with the sequences through a parkour
  - Possible controls should be takeoff, land, up, down, left, right, rotate, frontflip, backflip
- Tello EDU offers advanced commands in the API kit. The drone recognizes additional mission pads which may offer more programming accuracy.  


## References

https://dl-cdn.ryzerobotics.com/downloads/tello/20180910/Tello%20SDK%20Documentation%20EN_1.3.pdf
https://github.com/tensorflow/tfjs-models/tree/master/handpose



