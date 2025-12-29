// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
// Import all our API functions
//import { getPlants, addPlant, getReminders, addReminder, uploadPlantImage } from '../services/api'; 
import ReminderList from '../components/ReminderList.jsx';
import AddReminderModal from '../components/AddReminderModal.jsx';
import PredictionResult from '../components/PredictionResult.jsx'; // <-- 1. Import new component
// Add deletePlant to your import list
import { getPlants, addPlant, getReminders, addReminder, uploadPlantImage, deletePlant } from '../services/api';

function DashboardPage({ token }) {
  const [plants, setPlants] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [newPlantName, setNewPlantName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [message, setMessage] = useState('');

  // -Add new state for the AI feature ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [userPlants, userReminders] = await Promise.all([
        getPlants(token),
        getReminders(token)
      ]);
      setPlants(userPlants);
      const enrichedReminders = userReminders.map(r => ({
        ...r,
        plant: { name: userPlants.find(p => p._id === r.plant)?.name || 'Unknown Plant' }
      }));
      setReminders(enrichedReminders);
    } catch (error) {
      console.error(error.message);
      setMessage('Could not load your data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAddPlant = async (e) => {
    e.preventDefault();
    if (!newPlantName) return;
    try {
      await addPlant({ name: newPlantName }, token);
      setNewPlantName('');
      fetchData(); 
    } catch (error) {
      setMessage('Failed to add plant.');
    }
  };

  const handleAddReminder = async (reminderData) => {
    try {
      await addReminder(reminderData, token);
      fetchData(); 
      setIsModalOpen(false); 
    } catch (error) {
      setMessage('Failed to add reminder.');
    }
  };

  // --- 3. Add function to handle file selection ---
  const handleFileChange = (e) => {
    setPrediction(null); // Clear old prediction
    setSelectedFile(e.target.files[0]);
  };

  // --- 4. Add function to handle file upload ---
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Please select an image first.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    const formData = new FormData();
    formData.append('plantImage', selectedFile); // 'plantImage' must match backend

    try {
      const result = await uploadPlantImage(formData, token);
      console.log('Prediction result:', result);
      setPrediction(result);
    } catch (error) {
      console.error(error);
      setMessage('Failed to get prediction.');
    }
    
    setIsLoading(false);
  };

  const openReminderModal = (plant) => {
    setSelectedPlant(plant);
    setIsModalOpen(true);
  };
  // Add this inside the DashboardPage function
const handleDeletePlant = async (plantId) => {
  if (!window.confirm("Are you sure you want to remove this plant?")) return;

  try {
    await deletePlant(plantId, token); // Call the API [cite: 631]
    setPlants(plants.filter(plant => plant._id !== plantId)); // Update UI state [cite: 680]
    setMessage('Plant deleted successfully');
  } catch (error) {
    setMessage(error.message);
  }
};

  return (
    <div className="min-h-screen bg-off-white text-dark-green p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column for Plants & AI */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold">Your Plant Dashboard</h1>

          {/* --- 5. New AI Upload Section --- */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Plant Disease Detection</h2>
            <form onSubmit={handleImageUpload}>
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg"
                  className="flex-grow w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-olive-green"
                />
                <button
                  type="submit"
                  className="px-6 py-2 mt-2 sm:mt-0 text-white bg-dark-green rounded-lg hover:bg-olive-green"
                  disabled={isLoading}
                >
                  {isLoading ? 'Analyzing...' : 'Diagnose Plant'}
                </button>
              </div>
            </form>
            {/* --- 6. Show the prediction result --- */}
            <PredictionResult result={prediction} />
          </div>

          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Add a New Plant</h2>
            <form onSubmit={handleAddPlant}>
              {/* ... (add plant form is the same) ... */}
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Enter plant name"
                  value={newPlantName}
                  onChange={(e) => setNewPlantName(e.target.value)}
                  className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-olive-green"
                />
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-olive-green rounded-lg hover:bg-dark-green"
                >
                  Add Plant
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Plants</h2>
            {/* ... (plant list is the same) ... */}
            <div className="space-y-4">
              {plants.length > 0 ? (
                plants.map(plant => (
                  <div key={plant._id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
                    <p className="text-xl">{plant.name}</p>
                    <button onClick={() => openReminderModal(plant)} className="px-3 py-1 text-sm bg-lime-green text-dark-green rounded-md hover:bg-olive-green hover:text-white">
                      Add Reminder
                    </button>
                    <button 
              onClick={() => handleDeletePlant(plant._id)} 
              className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
            >
              Delete
            </button>
                  </div>
                ))
              ) : (
                <p>You haven't added any plants yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column for Reminders */}
        <div className="p-6 bg-white/50 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Upcoming Reminders</h2>
          <ReminderList reminders={reminders} />
        </div>

      </div>
      {isModalOpen && (
        <AddReminderModal 
          plant={selectedPlant} 
          onClose={() => setIsModalOpen(false)} 
          onReminderAdded={handleAddReminder} 
        />
      )}
      {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
    </div>
  );
}

export default DashboardPage;