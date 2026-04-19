// backend/models/Activity.js
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  exercise: {
    jogging: { type: Object, default: {} },
    gym: { type: Object, default: {} },
    yoga: { type: Object, default: {} },
    sleep: { type: Object, default: {} }
  },
  food: {
    breakfast: { type: Object, default: {} },
    lunch: { type: Object, default: {} },
    dinner: { type: Object, default: {} },
    snack: { type: Object, default: {} }
  },
  mental: {
    stress: { type: Object, default: {} }
  },
  date: {
    type: String, // Store as YYYY-MM-DD
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure one record per user per date
activitySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Activity", activitySchema);
