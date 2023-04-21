const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};
export const drawHand = (predictions, ctx) => {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const landmarks = prediction.landmarks;

      Object.keys(fingerJoints).forEach((fingerJointKey) => {
        const fingerJoint = fingerJoints[fingerJointKey];
        fingerJoint.forEach((dot, index) => {
          if (fingerJoint.length - 1 > index) {
            ctx.beginPath();
            ctx.moveTo(landmarks[dot][0], landmarks[dot][1]);
            ctx.lineTo(landmarks[fingerJoint[index + 1]][0], landmarks[fingerJoint[index + 1]][1]);
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 4;
            ctx.stroke();
          }
        });
      });

      landmarks.forEach((landmark) => {
        const [x, y] = landmark;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 3 * Math.PI);
        ctx.fillStyle = "aqua";
        ctx.fill();
      });
    });
  }
};
