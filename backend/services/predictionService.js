// backend/services/predictionService.js
import * as tf from '@tensorflow/tfjs-node';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// These lines are needed to get the directory path in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let model;
let labels;
const MODEL_PATH = path.resolve(__dirname, '../model/model.json');
const LABELS_PATH = path.resolve(__dirname, '../model/labels.json');

// Function to load the model and labels
export const loadModel = async () => {
  if (model && labels) return; // Don't load if already loaded
  
  try {
    // Load the model
    console.log('Loading AI model...');
    model = await tf.loadLayersModel(`file://${MODEL_PATH}`);
    console.log('AI Model loaded successfully.');

    // Load the labels
    console.log('Loading labels...');
    const labelsJson = fs.readFileSync(LABELS_PATH, 'utf8');
    labels = JSON.parse(labelsJson);
    console.log('Labels loaded successfully.');

  } catch (error) {
    console.error('Error loading model or labels:', error);
  }
};

// Function to make a prediction
export const makePrediction = async (imagePath) => {
  if (!model || !labels) {
    throw new Error('Model or labels are not loaded yet.');
  }

  // 1. Load and process the image
  const imageBuffer = fs.readFileSync(imagePath);
  let tensor = tf.node.decodeImage(imageBuffer)
    .resizeNearestNeighbor([224, 224]) // New, correct size // Use the correct size for your model
    .toFloat()
    .div(tf.scalar(255.0))
    .expandDims();

  // 2. Make a prediction
  const predictions = await model.predict(tensor).data();
  
  // 3. Find the index with the highest probability
  let topPredictionIndex = 0;
  for (let i = 1; i < predictions.length; i++) {
    if (predictions[i] > predictions[topPredictionIndex]) {
      topPredictionIndex = i;
    }
  }

  const confidence = Math.round(predictions[topPredictionIndex] * 100);
  const label = labels[topPredictionIndex];
  
  // 4. Return the result
  return { label, confidence };
};