// src/components/ReminderList.jsx

function ReminderList({ reminders }) {
  if (reminders.length === 0) {
    return <p className="text-sm text-gray-500 mt-2">No reminders set for your plants.</p>;
  }

  return (
    <div className="space-y-2 mt-4">
      {reminders.map(reminder => (
        <div key={reminder._id} className="p-3 bg-lime-green/20 rounded-md text-sm">
          <p className="font-bold">{reminder.reminderType} for {reminder.plant.name}</p>
          <p>Next Due: {new Date(reminder.nextDueDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default ReminderList;