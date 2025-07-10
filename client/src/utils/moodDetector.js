import * as faceapi from "face-api.js";

export const loadModels = async () => {
  const MODEL_URL = "/models";
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL + "/tiny_face_detector_model");
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL + "/face_expression_model");
};

export const detectMood = async (imageElement) => {
  const detections = await faceapi
    .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  console.log("Expressions:", detections?.expressions); // 👈 Add this

  if (!detections || !detections.expressions) {
    return "No face detected";
  }

  // Get the expression with the highest confidence
  const expressions = detections.expressions;
  const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
  const topExpression = sorted[0][0];
  return topExpression;
};
