const mongoose = require('mongoose');

async function checkDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/fitnessDB');
    console.log('Connected to DB');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    const activities = await db.collection('activities').find().toArray();
    console.log(`Found ${activities.length} activities`);
    if (activities.length > 0) {
      console.log('Latest Activity:', JSON.stringify(activities[activities.length - 1], null, 2));
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

checkDB();
