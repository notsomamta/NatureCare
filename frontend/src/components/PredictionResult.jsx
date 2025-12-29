// src/components/PredictionResult.jsx

function PredictionResult({ result }) {
  if (!result) return null;

  // The backend sends the path like: /uploads/plantImage-123.jpg
  // We need the full URL to the backend server to display it.
  const imageUrl = `http://localhost:3000${result.imagePath}`;

  // Parse the label (e.g., "Tomato___healthy")
  const [plant, disease] = result.prediction.label.split('___');
  const plantName = plant.replace(/_/g, ' ');
  const diseaseName = disease.replace(/_/g, ' ');

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md animate-fade-in">
      <h3 className="text-xl font-bold text-dark-green mb-2">Diagnosis Result</h3>
      <div className="flex flex-col md:flex-row gap-4">
        <img src={imageUrl} alt="Uploaded plant" className="w-full md:w-1/2 rounded-lg" />
        <div className="flex-1">
          <p>
            <strong className="text-dark-green">Plant:</strong> {plantName}
          </p>
          <p>
            <strong className="text-dark-green">Condition:</strong> 
            <span className={diseaseName === 'healthy' ? 'text-green-600' : 'text-red-600'}>
              {diseaseName}
            </span>
          </p>
          <p>
            <strong className="text-dark-green">Confidence:</strong> {result.prediction.confidence}%
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-olive-green h-2.5 rounded-full" 
              style={{ width: `${result.prediction.confidence}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add a simple fade-in animation to index.css
// You can add this to your src/index.css file:
/*
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
*/

export default PredictionResult;