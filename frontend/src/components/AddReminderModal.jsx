// src/components/AddReminderModal.jsx
import { useState } from 'react';

function AddReminderModal({ plant, onClose, onReminderAdded }) {
  const [nextDueDate, setNextDueDate] = useState('');
  const [frequency, setFrequency] = useState('Every 7 days');

  const handleSubmit = (e) => {
    e.preventDefault();
    onReminderAdded({
      plantId: plant._id,
      nextDueDate,
      frequency,
      reminderType: 'Watering', // Defaulting to watering for now
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Add Reminder for {plant.name}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-dark-green">Next Due Date</label>
            <input
              type="date"
              value={nextDueDate}
              onChange={(e) => setNextDueDate(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-dark-green">Frequency</label>
            <select 
              value={frequency} 
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            >
              <option>Every 3 days</option>
              <option>Every 7 days</option>
              <option>Every 14 days</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-olive-green text-white rounded-lg">Set Reminder</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddReminderModal;