import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import { activityApi } from '../utils/api';

export const JoggingForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ 
    startTime: '', 
    endTime: '', 
    distanceKm: '', 
    activityType: 'Light Jogging', 
    date: new Date().toISOString().split('T')[0] 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await activityApi.fetch(user.id);
        if (res.success && res.data.exercise?.jogging) setFormData(p => ({ ...p, ...res.data.exercise.jogging }));
      } catch { console.error("Fetch error"); } finally { setLoading(false); }
    };
    fetchData();
  }, [user.id]);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dur = Math.round((new Date(`2000-01-01 ${formData.endTime}`) - new Date(`2000-01-01 ${formData.startTime}`)) / 60000);
    if (dur <= 0 || !formData.distanceKm) return toast.error('Enter distance and check times');
    try {
      await activityApi.save(user.id, 'Jogging', { ...formData, duration: dur, caloriesBurned: Math.round(parseFloat(formData.distanceKm) * 65) });
      toast.success('Jogging logged'); navigate('/');
    } catch { toast.error("Save failed"); }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Jogging Log</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select name="activityType" value={formData.activityType} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
            {['Brisk Walking', 'Light Jogging', 'Running', 'Cycling'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-bold text-gray-400 ml-1 uppercase">Start</label><input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" /></div>
            <div><label className="text-xs font-bold text-gray-400 ml-1 uppercase">End</label><input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" /></div>
          </div>
          <input type="number" step="0.1" name="distanceKm" placeholder="Distance (Km)" value={formData.distanceKm} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-sm">Save Jogging</button>
        </form>
      </div>
    </div>
  );
};

export const GymForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [focusArea, setFocusArea] = useState('Full Body');
  const [duration, setDuration] = useState('');

  const exercisesList = ['Push-ups', 'Squats', 'Dumbbell Lifts', 'Bench Press', 'Pull-ups', 'Plank'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await activityApi.fetch(user.id);
        if (res.success && res.data.exercise?.gym) {
          const g = res.data.exercise.gym;
          const normalized = (g.selectedExercises || []).map(ex => 
            typeof ex === 'string' ? { name: ex, count: 10 } : ex
          );
          setSelectedExercises(normalized);
          setFocusArea(g.focusArea || 'Full Body');
          setDuration(g.duration || '');
        }
      } catch { console.error("Fetch error"); } finally { setLoading(false); }
    };
    fetchData();
  }, [user.id]);

  const toggleEx = (exName) => {
    setSelectedExercises(p => {
      const exists = p.find(i => i.name === exName);
      if (exists) return p.filter(i => i.name !== exName);
      return [...p, { name: exName, count: 10 }];
    });
  };

  const handleCountChange = (exName, newCount) => {
    setSelectedExercises(p => p.map(i => 
      i.name === exName ? { ...i, count: parseInt(newCount) || 0 } : i
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!duration) return toast.error('Enter duration');
    try {
      await activityApi.save(user.id, 'Gym', { 
        duration: parseInt(duration), 
        selectedExercises, 
        focusArea, 
        caloriesBurned: parseInt(duration) * 10,
        date: new Date().toISOString().split('T')[0] 
      });
      toast.success('Gym session saved with counts'); navigate('/');
    } catch { toast.error("Save failed"); }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Gym Session</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Workout Focus</label>
            <select value={focusArea} onChange={e => setFocusArea(e.target.value)} className="w-full px-4 py-2 border rounded-md">
              {['Upper Body', 'Lower Body', 'Core', 'Full Body'].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Exercises</label>
            <div className="flex flex-wrap gap-2">
              {exercisesList.map(ex => (
                <button 
                  key={ex} 
                  type="button" 
                  onClick={() => toggleEx(ex)} 
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedExercises.find(i => i.name === ex) ? 'bg-blue-600 text-white border-blue-600 scale-105' : 'bg-white text-gray-500 border-gray-200'}`}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {selectedExercises.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-dashed border-gray-300">
              <label className="text-[10px] font-black text-gray-400 uppercase">Enter Reps/Counts</label>
              {selectedExercises.map(ex => (
                <div key={ex.name} className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">{ex.name}</span>
                  <input 
                    type="number" 
                    value={ex.count} 
                    onChange={(e) => handleCountChange(ex.name, e.target.value)}
                    className="w-20 px-2 py-1 border rounded text-center font-bold text-blue-600"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Duration (min)</label>
            <input type="number" placeholder="e.g. 45" value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-4 py-2 border rounded-md font-bold text-lg" />
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            <span>💾</span> Save Workout Volume
          </button>
        </form>
      </div>
    </div>
  );
};

export const YogaForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState('');
  const [poses, setPoses] = useState([]);
  const [meditation, setMeditation] = useState([]);

  const posesList = ['Surya Namaskar', 'Tadasana', 'Bhujangasana', 'Child’s Pose', 'Tree Pose'];
  const medList = ['Deep Breathing', 'Mindfulness', 'Guided Meditation'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await activityApi.fetch(user.id);
        if (res.success && res.data.exercise?.yoga) {
          const y = res.data.exercise.yoga;
          setDuration(y.duration || '');
          setPoses(y.poses || []);
          setMeditation(y.meditation || []);
        }
      } catch { console.error("Fetch error"); } finally { setLoading(false); }
    };
    fetchData();
  }, [user.id]);

  const toggle = (list, set, it) => set(p => p.includes(it) ? p.filter(i => i !== it) : [...p, it]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!duration) return toast.error('Enter duration');
    try {
      await activityApi.save(user.id, 'Yoga', { 
        duration: parseInt(duration), 
        poses, 
        meditation, 
        caloriesBurned: parseInt(duration) * 5, 
        date: new Date().toISOString().split('T')[0] 
      });
      toast.success('Yoga & Meditation logged'); navigate('/');
    } catch { toast.error("Save failed"); }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Yoga & Meditation</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Yoga Poses</label>
            <div className="flex flex-wrap gap-2">
              {posesList.map(p => <button key={p} type="button" onClick={() => toggle(poses, setPoses, p)} className={`px-3 py-1.5 rounded-md text-xs font-bold border ${poses.includes(p) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-100'}`}>{p}</button>)}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Meditation</label>
            <div className="flex flex-wrap gap-2">
              {medList.map(m => <button key={m} type="button" onClick={() => toggle(meditation, setMeditation, m)} className={`px-3 py-1.5 rounded-md text-xs font-bold border ${meditation.includes(m) ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-500 border-gray-100'}`}>{m}</button>)}
            </div>
          </div>
          <input type="number" placeholder="Total Duration (min)" value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg shadow-md shadow-indigo-100 italic">Save Mental Wellness</button>
        </form>
      </div>
    </div>
  );
};

export const SleepForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await activityApi.fetch(user.id);
        if (res.success && res.data.exercise?.sleep) setHours(res.data.exercise.sleep.sleepHours || '');
      } catch { console.error("Fetch error"); } finally { setLoading(false); }
    };
    fetchData();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hours) return toast.error('Enter hours');
    try {
      await activityApi.save(user.id, 'Sleep', { sleepHours: parseFloat(hours), date: new Date().toISOString().split('T')[0] });
      toast.success('Sleep logged'); navigate('/');
    } catch { toast.error("Save failed"); }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Sleep Log</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="number" step="0.1" placeholder="Hours" value={hours} onChange={e => setHours(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg">Save Sleep Data</button>
        </form>
      </div>
    </div>
  );
};
