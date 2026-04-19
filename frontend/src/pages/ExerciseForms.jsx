import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { saveModuleData, getModuleData } from '../utils/storageUtils';

export const JoggingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const saved = getModuleData('Jogging');
    return saved || {
      startTime: '',
      endTime: '',
      distanceKm: '',
      date: new Date().toISOString().split('T')[0]
    };
  });

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    
    const start = new Date(`2000-01-01 ${formData.startTime}`);
    const end = new Date(`2000-01-01 ${formData.endTime}`);
    
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    const diffMs = end - start;
    const diffMins = diffMs / (1000 * 60);
    return Math.round(diffMins);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.startTime || !formData.endTime || !formData.distanceKm) {
      toast.error('Please fill in all fields including distance');
      return;
    }

    const duration = calculateDuration();
    if (duration <= 0) {
      toast.error('End time must be after start time');
      return;
    }

    const distance = parseFloat(formData.distanceKm);
    
    // Roughly 65 calories per km for jogging, fallback to duration based if something goes wrong
    const caloriesBurned = distance ? Math.round(distance * 65) : (duration * 8);

    const dataToSave = {
      ...formData,
      distanceKm: distance,
      duration,
      caloriesBurned
    };

    saveModuleData('Jogging', dataToSave);
    toast.success(`Jogging logged: ${duration} minutes`);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Jogging Log</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distance (Km)
            </label>
            <input
              type="number"
              step="0.1"
              name="distanceKm"
              value={formData.distanceKm}
              onChange={handleChange}
              placeholder="e.g., 5"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>

          {formData.startTime && formData.endTime && formData.distanceKm && (
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-center flex flex-col gap-1">
              <p className="text-blue-900 font-medium text-lg">
                Duration: <span className="font-bold">{calculateDuration()}</span> min
              </p>
              <div className="flex justify-center gap-6 mt-1 text-sm text-blue-700">
                <p>Distance: <span className="font-bold">{formData.distanceKm}</span> km</p>
                <p>Calories: <span className="font-bold">{Math.round(parseFloat(formData.distanceKm || 0) * 65)}</span> cal</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition-colors"
            >
              Save Data
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const GymForm = () => {
  const navigate = useNavigate();
  const savedGym = getModuleData('Gym') || {};
  const [selectedSchedule, setSelectedSchedule] = useState(savedGym.selectedSchedule || '');
  const [duration, setDuration] = useState(savedGym.duration || '');
  const [date, setDate] = useState(savedGym.date || new Date().toISOString().split('T')[0]);

  const workoutSchedules = {
    'Day 1: Chest & Triceps': {
      exercises: [
        'Bench Press - 4 sets × 8-12 reps',
        'Incline Dumbbell Press - 3 sets × 10-12 reps',
        'Chest Flyes - 3 sets × 12-15 reps',
        'Tricep Dips - 3 sets × 10-12 reps',
        'Tricep Pushdowns - 3 sets × 12-15 reps',
        'Overhead Tricep Extension - 3 sets × 10-12 reps'
      ],
      caloriesPerMinute: 12
    },
    'Day 2: Back & Biceps': {
      exercises: [
        'Deadlifts - 4 sets × 6-8 reps',
        'Pull-ups/Lat Pulldowns - 3 sets × 8-12 reps',
        'Bent-over Rows - 3 sets × 8-12 reps',
        'Seated Cable Rows - 3 sets × 10-12 reps',
        'Barbell Curls - 3 sets × 10-12 reps',
        'Hammer Curls - 3 sets × 12-15 reps'
      ],
      caloriesPerMinute: 11
    },
    'Day 3: Legs & Shoulders': {
      exercises: [
        'Squats - 4 sets × 8-10 reps',
        'Leg Press - 3 sets × 10-12 reps',
        'Lunges - 3 sets × 10 reps per leg',
        'Leg Curls - 3 sets × 12-15 reps',
        'Military Press - 3 sets × 8-12 reps',
        'Lateral Raises - 3 sets × 12-15 reps'
      ],
      caloriesPerMinute: 13
    },
    'Day 4: Chest & Back': {
      exercises: [
        'Incline Bench Press - 4 sets × 8-12 reps',
        'Pull-ups - 3 sets × 8-12 reps',
        'Dumbbell Flyes - 3 sets × 10-12 reps',
        'T-Bar Rows - 3 sets × 8-12 reps',
        'Cable Crossovers - 3 sets × 12-15 reps',
        'Face Pulls - 3 sets × 12-15 reps'
      ],
      caloriesPerMinute: 12
    },
    'Day 5: Arms & Core': {
      exercises: [
        'Close-grip Bench Press - 3 sets × 8-12 reps',
        'Preacher Curls - 3 sets × 10-12 reps',
        'Skull Crushers - 3 sets × 10-12 reps',
        'Concentration Curls - 3 sets × 12-15 reps',
        'Planks - 3 sets × 30-60 seconds',
        'Russian Twists - 3 sets × 20 reps per side'
      ],
      caloriesPerMinute: 10
    },
    'Day 6: Full Body': {
      exercises: [
        'Clean and Press - 4 sets × 6-8 reps',
        'Romanian Deadlifts - 3 sets × 8-10 reps',
        'Push-ups - 3 sets × max reps',
        'Bent-over Rows - 3 sets × 10-12 reps',
        'Squats - 3 sets × 10-12 reps',
        'Burpees - 3 sets × 10 reps'
      ],
      caloriesPerMinute: 14
    }
  };

  const calculateCalories = () => {
    if (!selectedSchedule || !duration) return 0;
    const schedule = workoutSchedules[selectedSchedule];
    return parseInt(duration) * schedule.caloriesPerMinute;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSchedule || !duration) {
      toast.error('Please select a workout schedule and enter duration');
      return;
    }

    const schedule = workoutSchedules[selectedSchedule];
    const caloriesBurned = calculateCalories();

    const dataToSave = {
      selectedSchedule,
      exercises: schedule.exercises,
      duration: parseInt(duration),
      caloriesBurned,
      date,
      timestamp: new Date().toISOString()
    };

    saveModuleData('Gym', dataToSave);
    toast.success(`${selectedSchedule} completed: ${duration} mins`);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Gym Workout Log</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Select Routine</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.keys(workoutSchedules).map((scheduleName) => (
                <button
                  key={scheduleName}
                  type="button"
                  onClick={() => setSelectedSchedule(scheduleName)}
                  className={`p-4 rounded-md border text-left transition-all ${
                    selectedSchedule === scheduleName
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className={`font-medium ${selectedSchedule === scheduleName ? 'text-blue-700' : 'text-gray-800'}`}>
                    {scheduleName.split(':')[0]}
                  </div>
                  <div className={`text-sm mt-1 ${selectedSchedule === scheduleName ? 'text-blue-600' : 'text-gray-500'}`}>
                    {scheduleName.split(':')[1]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedSchedule && (
            <div className="bg-gray-50 p-5 rounded-md border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-3">{selectedSchedule}</h4>
              <div className="space-y-2">
                {workoutSchedules[selectedSchedule].exercises.map((exercise, index) => (
                  <div key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    {exercise}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workout Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 60"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>

          {selectedSchedule && duration && (
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-center">
              <p className="text-blue-900 font-medium text-lg">
                Duration: <span className="font-bold">{duration}</span> min
              </p>
              <p className="text-blue-700 text-sm mt-1">
                Calories Burned: <span className="font-bold">{calculateCalories()}</span> cal
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition-colors"
            >
              Complete Workout
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const YogaForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const saved = getModuleData('Yoga');
    return saved || {
      duration: '',
      asanasDone: '',
      intensity: 'Medium',
      date: new Date().toISOString().split('T')[0]
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.duration || !formData.asanasDone) {
      toast.error('Please fill in all fields');
      return;
    }

    const multiplier = formData.intensity === 'High' ? 6 : formData.intensity === 'Low' ? 3 : 4;
    const caloriesBurned = parseInt(formData.duration) * multiplier;

    const dataToSave = {
      ...formData,
      duration: parseInt(formData.duration),
      asanasDone: parseInt(formData.asanasDone),
      caloriesBurned
    };

    saveModuleData('Yoga', dataToSave);
    toast.success(`Yoga logged: ${formData.duration} minutes`);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Yoga Log</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 30"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Asanas
            </label>
            <input
              type="number"
              name="asanasDone"
              value={formData.asanasDone}
              onChange={handleChange}
              placeholder="e.g., 5"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intensity Level
            </label>
            <select
              name="intensity"
              value={formData.intensity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            >
              <option value="Low">Low (Restorative / Stretching)</option>
              <option value="Medium">Medium (Hatha / Vinyasa Base)</option>
              <option value="High">High (Power / Ashtanga)</option>
            </select>
          </div>

          {formData.duration && (
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-center flex flex-col gap-1">
              <p className="text-blue-900 font-medium">
                Calories Burned: <span className="text-xl font-bold">
                  {parseInt(formData.duration) * (formData.intensity === 'High' ? 6 : formData.intensity === 'Low' ? 3 : 4)}
                </span> cal
              </p>
              <p className="text-sm text-blue-700">Based on {formData.intensity.toLowerCase()} intensity</p>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition-colors"
            >
              Save Data
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const SleepForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const saved = getModuleData('Sleep');
    return saved || {
      bedTime: '',
      wakeTime: '',
      date: new Date().toISOString().split('T')[0]
    };
  });

  const calculateSleepHours = () => {
    if (!formData.bedTime || !formData.wakeTime) return 0;
    
    const bed = new Date(`2000-01-01 ${formData.bedTime}`);
    const wake = new Date(`2000-01-01 ${formData.wakeTime}`);
    
    if (wake < bed) {
      wake.setDate(wake.getDate() + 1);
    }
    
    const diffMs = wake - bed;
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.round(diffHours * 10) / 10;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.bedTime || !formData.wakeTime) {
      toast.error('Please fill in all fields');
      return;
    }

    const hours = calculateSleepHours();
    if (hours <= 0) {
      toast.error('Wake time must be after bed time');
      return;
    }

    const dataToSave = {
      ...formData,
      sleepHours: hours
    };

    saveModuleData('Sleep', dataToSave);
    toast.success(`Sleep logged: ${hours} hours`);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sleep Log</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bed Time
            </label>
            <input
              type="time"
              name="bedTime"
              value={formData.bedTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wake Time
            </label>
            <input
              type="time"
              name="wakeTime"
              value={formData.wakeTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>

          {formData.bedTime && formData.wakeTime && (
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-center">
              <p className="text-blue-900 font-medium text-lg">
                Sleep Context: <span className="font-bold mx-1">{calculateSleepHours()}</span> hours
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition-colors"
            >
              Save Data
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
