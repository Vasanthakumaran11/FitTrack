// backend/routes/activity.js
const express = require("express");
const Activity = require("../models/Activity");

const router = express.Router();

// Save or Update activity data
router.post("/save", async (req, res) => {
  const { userId, moduleName, moduleData } = req.body;

  if (!userId || !moduleName || !moduleData) {
    return res.status(400).json({ success: false, msg: "Missing required fields" });
  }

  const date = moduleData.date || new Date().toISOString().split("T")[0];
  const lowerName = moduleName.toLowerCase();
  
  const isExercise = ["jogging", "gym", "yoga", "sleep"].includes(lowerName);
  const isFood = ["breakfast", "lunch", "dinner", "snack"].includes(lowerName);

  try {
    let activity = await Activity.findOne({ userId, date });

    if (!activity) {
      activity = new Activity({ userId, date });
    }

    if (isExercise) {
      activity.exercise[lowerName] = moduleData;
    } else if (isFood) {
      activity.food[lowerName] = moduleData;
    } else {
      return res.status(400).json({ success: false, msg: "Invalid module name" });
    }

    // Force Mongoose to recognize changes in nested objects
    activity.markModified('exercise');
    activity.markModified('food');
    
    await activity.save();
    res.json({ success: true, msg: `${moduleName} data saved`, activity });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ success: false, msg: "Server error while saving activity" });
  }
});

// Fetch all activity data for a specific user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Get all records for this user (minimal version: returns latest record for now to mimic current app)
    // Or return all and let frontend decide? For now, we'll return the latest one to match formatDataForAnalysis
    const activities = await Activity.find({ userId }).sort({ date: -1 });
    
    if (!activities || activities.length === 0) {
      return res.json({ success: true, data: {} });
    }

    // For a "minimal" flow, we'll return the latest record's structure
    res.json({ 
      success: true, 
      data: activities 
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server error while fetching data" });
  }
});

// Clear all history for a user
router.delete("/clear/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    await Activity.deleteMany({ userId });
    res.json({ success: true, msg: "All activity data cleared" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server error while clearing data" });
  }
});

module.exports = router;
