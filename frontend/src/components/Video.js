import React, {useRef, useEffect} from "react";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import {drawHand} from "../utils/drawHand";
import * as fp from "fingerpose";
import thumbsDown from "../fingerposes/thumbsDown";
// tf is required for loading the handpose model
// eslint-disable-next-line no-unused-vars
import * as tf from "@tensorflow/tfjs";
import {controlDroneBasedOnGesture} from "../utils/droneControl";
import {CONNECTION_STATUS} from "../utils/constants";

export default function Video({
                                setDetectedGesture,
                                setDroneConnectionStatus,
                                setHandPoseModelStatus,
                                setGestureDetectionActive,
                                setDroneFlyingState,
                              }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async () => {
    try {
      const net = await handpose.load();
      setHandPoseModelStatus("loaded");
      setInterval(() => {
        detect(net);
      }, 100);
    } catch (err) {
      setHandPoseModelStatus("Couldn't load handpose model! Check your internet connection.");
    }
  };

  const detect = async (net) => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      let gestureDetectionActive = false;
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);
      setHandPoseModelStatus((prevValue) => {
        if (prevValue === "loaded") {
          return prevValue;
        } else {
          return "loaded";
        }
      });

      setGestureDetectionActive((currentValue) => {
        if (!currentValue) {
          setDetectedGesture("no gesture");
        }
        gestureDetectionActive = currentValue;
        return currentValue;
      });

      if (gestureDetectionActive && hand.length > 0) {
        const GE = new fp.GestureEstimator([fp.Gestures.VictoryGesture, fp.Gestures.ThumbsUpGesture, thumbsDown]);
        const gesture = await GE.estimate(hand[0].landmarks, 7);
        if (gesture.gestures.length > 0) {
          const confidence = gesture.gestures.map((prediction) => prediction.confidence);
          const maxConfidence = confidence.indexOf(Math.max.apply(null, confidence));
          setDetectedGesture(gesture.gestures[maxConfidence].name);
          setDroneConnectionStatus((connectionStatus) => {
            if (connectionStatus === CONNECTION_STATUS.connected) {
              setDroneFlyingState((currentValue) =>
                controlDroneBasedOnGesture(gesture.gestures[maxConfidence].name, currentValue)
              );
            }
            return connectionStatus;
          });
        } else {
          setDetectedGesture("no gesture");
        }
        const ctx = canvasRef.current.getContext("2d");
        drawHand(hand, ctx);
      }
    }
  };

  useEffect(() => {
    runHandpose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <div style={{display: "flex", justifyContent: "center"}}>
        <Webcam
          ref={webcamRef}
          audio={false}
          style={{
            position: "absolute",
            textAlign: "center",
            marginLeft: "auto",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            textAlign: "center",
            position: "absolute",
            marginLeft: "auto",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </div>
    </React.Fragment>
  );
}
