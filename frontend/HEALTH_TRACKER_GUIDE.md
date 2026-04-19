# 🏥 Health Tracker Application - Complete Guide

## 📋 Overview
This is a comprehensive health tracking application that helps you monitor your daily:
- **Exercises**: Jogging, Gym, Yoga, Sleep
- **Food Intake**: Breakfast, Lunch, Dinner, Snacks
- **Health Metrics**: Calories, Sleep Quality, Stress Level, Overall Health Score

All data is stored locally in your browser using localStorage (no backend required).

---

## 🚀 Getting Started

### Run the Application
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5174`

---

## 📱 How to Use

### 1. **Home Page** (`/`)
- See 8 activity cards: Sleep, Gym, Yoga, Jogging, Breakfast, Lunch, Dinner, Snack
- Each card has an "Add Data" button (changes to "✓ Update Data" if data exists)
- At the bottom, when you have any data saved, a "Generate Analysis" button appears

### 2. **Adding Exercise Data**

#### **Jogging Form** (`/Jogging`)
- Enter **Start Time** and **End Time**
- Duration is auto-calculated in minutes
- Calories burned = Duration × 8 cal/min
- Example: 30 min jogging = 240 calories burned
- Click "Save Data" to store

#### **Gym Form** (`/Gym`)
- Enter **Duration** (in minutes)
- Describe your **Workouts** (e.g., "Push-ups, Bench press, Squats")
- Calories burned = Duration × 10 cal/min
- Example: 60 min gym = 600 calories burned
- Click "Save Data"

#### **Yoga Form** (`/Yoga`)
- Enter **Duration** (in minutes)
- Enter **Number of Asanas Done**
- Calories burned = Duration × 4 cal/min
- Example: 30 min yoga (5 asanas) = 120 calories burned
- Click "Save Data"

#### **Sleep Form** (`/Sleep`)
- Enter **Bed Time** and **Wake Time**
- Sleep hours are auto-calculated
- If wake time is next day, the app handles it automatically
- Click "Save Data"

### 3. **Adding Food Data**

#### **Breakfast Form** (`/BreakFast`)
- Enter **Food Item** (e.g., "Oatmeal with berries")
- Enter **Calories** (e.g., 350)
- Enter **Quantity** (e.g., "1 bowl" or "200g")
- Add optional **Notes** (e.g., "Added honey")
- Click "Save Data"

#### **Lunch Form** (`/Lunch`)
- Same fields as Breakfast
- Enter your lunch details and calories

#### **Dinner Form** (`/Dinner`)
- Same fields as Breakfast
- Enter your dinner details and calories

#### **Snack Form** (`/Snack`)
- Same fields as Breakfast
- Enter snack details and calories

### 4. **Analyzing Your Health** (`/analysis`)
Click the **"Generate Analysis"** button to see:

#### **Overall Health Score** (0-100 with Grade)
- **A+/A**: Excellent (90-100)
- **B**: Good (70-89)
- **C**: Average (60-69)
- **D**: Poor (50-59)
- **F**: Very Poor (below 50)

#### **Main Metrics Displayed**
1. **🔥 Calories Burned**: Total calories from all exercises
2. **🍽️ Calories Intake**: Total calories from all food
3. **⚖️ Calorie Balance**: Difference between intake and burned
4. **😴 Sleep Duration**: Total hours slept with status (Poor/Good/Oversleep)
5. **🧠 Stress Level**: High/Moderate/Low
6. **🧘 Yoga Practice**: Minutes and asanas done

#### **Score Breakdown**
- Calorie Balance: 30%
- Sleep Quality: 30%
- Yoga Practice: 20%
- Stress Level: 20%

#### **Personalized Recommendations**
- Warnings if calories are too high or low
- Sleep improvement suggestions
- Stress reduction tips
- Positive feedback if you're doing great!

#### **Today's Activity Summary**
- All your logged activities with details
- Quick reference for the entire day

---

## 📊 Calculation Details

### Calorie Burn Rates (Fixed)
| Activity | Calories/Minute |
|----------|----------------|
| Jogging  | 8              |
| Gym      | 10             |
| Yoga     | 4              |

### Sleep Status Classification
| Hours | Status |
|-------|--------|
| < 6   | Poor   |
| 6-8   | Good   |
| > 8   | Oversleep |

### Stress Level Logic
- **Low**: Good yoga (≥20 min) AND good sleep (6-8 hours)
- **Moderate**: Mixed yoga and sleep
- **High**: Low yoga (<20 min) AND poor sleep (<6 hours)

### Health Score Formula
```
Total Score = 
  (Calorie Balance Score × 30%) +
  (Sleep Quality Score × 30%) +
  (Yoga Score × 20%) +
  (Stress Score × 20%)
```

---

## 💾 Data Storage

### How It Works
- All data is saved to browser's localStorage with key: `"healthData"`
- Data persists even after closing the browser
- No server/backend is used

### Data Structure
```javascript
{
  exercise: {
    jogging: { startTime, endTime, duration, caloriesBurned, date },
    gym: { duration, workouts, caloriesBurned, date },
    yoga: { duration, asanasDone, caloriesBurned, date },
    sleep: { bedTime, wakeTime, sleepHours, date }
  },
  food: {
    breakfast: { food, calories, quantity, notes, date },
    lunch: { food, calories, quantity, notes, date },
    dinner: { food, calories, quantity, notes, date },
    snack: { food, calories, quantity, notes, date }
  }
}
```

### Clearing Data
On the Analysis Dashboard, you can:
- **"🔄 Start New Day"**: Clears all data and redirects to home
- **"🗑️ Clear Data"**: Removes all data
- **"← Back to Home"**: Returns to home page without clearing

---

## 🔧 Technical Stack

- **Framework**: React 19
- **Routing**: React Router v7
- **UI**: Tailwind CSS
- **Storage**: Browser localStorage
- **Notifications**: React-toastify
- **Build Tool**: Vite 8

## 📁 Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Home/
│   │   │   ├── navbar.jsx
│   │   │   ├── hero.jsx
│   │   │   ├── activities.jsx
│   │   │   └── footer.jsx
│   │   └── Dashboard/
│   │       └── DashboardCard.jsx
│   ├── hooks/
│   │   ├── useCalories.js
│   │   ├── useSleep.js
│   │   ├── useStress.js
│   │   └── useScore.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ExerciseForms.jsx (Jogging, Gym, Yoga, Sleep)
│   │   ├── FoodForms.jsx (Breakfast, Lunch, Dinner, Snack)
│   │   └── AnalysisDashboard.jsx
│   ├── utils/
│   │   └── storageUtils.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

---

## ✅ Features Implemented

✅ Data collection through forms  
✅ localStorage persistence  
✅ Custom calculation hooks  
✅ Health analysis dashboard  
✅ Personalized recommendations  
✅ Color-coded metrics  
✅ Progress indicators  
✅ Day reset functionality  
✅ Update existing data  
✅ Responsive design  
✅ Toast notifications  
✅ No backend required  

---

## 🚀 Future Enhancements

### Backend Integration (Coming Soon)
Replace localStorage with API calls:
```javascript
// Instead of:
localStorage.setItem(...)

// Use:
fetch("/api/activity", { 
  method: "POST", 
  body: JSON.stringify(data) 
})
```

### Other Potential Features
- User authentication
- Historical data tracking
- Multiple day comparison
- Export health reports
- Wearable integration
- More detailed nutrition tracking
- Water intake tracking
- Workout templates
- Meal plans

---

## 🐛 Troubleshooting

### Data not saving?
- Check browser's localStorage (DevTools → Application → LocalStorage)
- Ensure browser allows localStorage
- Try clearing cache and reload

### Forms not submitting?
- Ensure all required fields are filled
- Check browser console for errors
- Refresh the page

### Can't see "Generate Analysis" button?
- You need to have added at least one data entry
- Try adding a form entry and return to home

---

## 📞 Support

For issues or questions:
1. Check the browser console (F12)
2. Verify data in localStorage
3. Try clearing data and starting fresh
4. Check that all form fields are filled correctly

---

## 📝 Notes

- All times use 24-hour format (e.g., 14:30 for 2:30 PM)
- Dates are auto-set to today
- Calories are estimated based on duration (not exact science)
- Health scores are relative and educational
- No medical advice provided - consult a doctor for health concerns

---

**Enjoy tracking your health! 🏥💪**
