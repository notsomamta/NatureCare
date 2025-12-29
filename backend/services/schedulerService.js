// services/schedulerService.js

import cron from 'node-cron';
import Reminder from '../models/Reminder.js';
import User from '../models/User.js';
import Plant from '../models/Plant.js';
import { sendReminderEmail } from './mailService.js';

const startScheduler = () => {
  // cron job is scheduled to run every day at 11:00 AM.
  // 'minute hour day-of-month month day-of-week'
  
  cron.schedule('7 11 * * *', async () => {
    console.log('⏰ Running daily reminder check at 11:00 AM...');
    const now = new Date();

    try {
      //  reminders where the next due date is in the past or is today
      const dueReminders = await Reminder.find({ nextDueDate: { $lte: now } })
        .populate('user')  // Pulls in the full User document for name/email [cite: 50, 168]
        .populate('plant'); // Pulls in the full Plant document for the name [cite: 50, 168]

      if (dueReminders.length === 0) {
        console.log('No reminders are due today. Scheduler finished.');
        return;
      }
      
      console.log(`Found ${dueReminders.length} reminders to process...`);

      for (const reminder of dueReminders) {
        try {
          
          if (!reminder.plant || !reminder.user) {
            console.log(`⚠️ Skipping reminder ${reminder._id} due to missing Plant or User data (likely deleted).`);
            
            continue; 
          }

          // 1. Send the reminder email using Nodemailer [cite: 50, 206]
          const subject = `Reminder: Time to water your ${reminder.plant.name}!`;
          const text = `Hello ${reminder.user.name},\n\nThis is a friendly reminder that your plant, "${reminder.plant.name}", is due for watering today.\n\n- The NatureCare Team`;
          
          await sendReminderEmail(reminder.user.email, subject, text);

          // 2. Calculate and update the next due date [cite: 204, 205]
          const currentDueDate = new Date(reminder.nextDueDate);
          // Grabs the number from strings like "Every 7 days"
          const daysToAdd = parseInt(reminder.frequency.split(' ')[1]); 
          
          if (!isNaN(daysToAdd)) {
            currentDueDate.setDate(currentDueDate.getDate() + daysToAdd);
            reminder.nextDueDate = currentDueDate;
            await reminder.save(); // Save the updated date back to MongoDB [cite: 170, 292]
            console.log(`✅ Reminder sent for plant "${reminder.plant.name}" and next due date updated to ${reminder.nextDueDate.toDateString()}.`);
          }
        } catch (innerError) {
          console.error(`Failed to process individual reminder ${reminder._id}:`, innerError);
        }
      }
    } catch (error) {
      console.error('Error running the reminder scheduler:', error);
    }
  });
};

export { startScheduler };