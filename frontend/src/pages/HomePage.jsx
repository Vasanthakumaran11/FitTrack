import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Activities from '../components/Home/activities';
import { UserContext } from '../context/UserContext';
import { activityApi } from '../utils/api';

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState(null);
  const [stats, setStats] = useState({ totalCalories: 0, totalExercises: 0, totalSleep: 0, lastUpdated: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await activityApi.fetch(user.id);
        if (response.success && Array.isArray(response.data)) {
          const allActivities = response.data;
          setHealthData(allActivities);
          let cal = 0, exe = 0, slp = 0, lat = null;

          allActivities.forEach(day => {
            if (day.food) {
              Object.values(day.food).forEach(f => {
                if (f.totals) cal += f.totals.calories || 0;
                if (f.timestamp && (!lat || new Date(f.timestamp) > new Date(lat))) lat = f.timestamp;
              });
            }
            if (day.exercise) {
              Object.values(day.exercise).forEach(e => {
                if (e.caloriesBurned) { cal -= e.caloriesBurned; exe++; }
                if (e.sleepHours) slp += e.sleepHours;
                if (e.timestamp && (!lat || new Date(e.timestamp) > new Date(lat))) lat = e.timestamp;
              });
            }
          });
          setStats({ totalCalories: Math.max(0, cal), totalExercises: exe, totalSleep: Math.round(slp * 10) / 10, lastUpdated: lat });
        }
      } catch (e) {
        console.error("Fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const activities = [
    { img: "/sleep.avif", work: "Sleep", desc: "Track your sleep hours" },
    { img: "/Gym-1.jpg", work: "Gym", desc: "Log your gym workouts" },
    { img: "/images.jpg", work: "Yoga", desc: "Record your yoga sessions" },
    { img: "/jogging.webp", work: "Jogging", desc: "Track your jogging time" },
    { img: "/bk-1.jpg", work: "BreakFast", desc: "Log breakfast details" },
    { img: "/lunch-1.jpg", work: "Lunch", desc: "Record lunch items" },
    { img: "/dinner.jpg", work: "Dinner", desc: "Add dinner information" },
    { img: "/snack.jpg", work: "Snack", desc: "Log your snacks" }
  ];

  const hasData = Array.isArray(healthData) && healthData.length > 0;
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = hasData ? healthData.find(d => d.date === today) : null;

  if (loading) return <div className="text-center py-20">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <section className="bg-white border-b py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">Health Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome back, {user.username || 'User'}!</p>
      </section>

      <div className="w-[95%] lg:w-[90%] mx-auto px-4 mb-8">
        {hasData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-8 relative z-10 mb-12">
            {[
              { label: "Net Calories", value: stats.totalCalories, unit: "cal" },
              { label: "Workouts", value: stats.totalExercises, unit: "sessions" },
              { label: "Sleep", value: stats.totalSleep, unit: "hrs" }
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="text-gray-600 font-medium mb-1">{s.label}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-blue-600">{s.value}</span>
                  <span className="text-gray-500 text-sm">{s.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <section className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {activities.map((a, i) => {
              const lowerWork = a.work.toLowerCase();
              let isLogged = false;
              if (todayRecord) {
                if (todayRecord.exercise?.[lowerWork]) isLogged = true;
                if (todayRecord.food?.[lowerWork]) isLogged = true;
              }
              return <Activities key={i} {...a} isLogged={isLogged} />;
            })}
          </div>
        </section>

        {hasData && (
          <div className="bg-blue-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
            <div>
              <h2 className="text-2xl font-bold mb-2">Review Your Progress</h2>
              <p className="text-blue-100">View detailed analysis and personalized insights.</p>
            </div>
            <button onClick={() => navigate('/analysis')} className="mt-4 md:mt-0 px-6 py-3 bg-white text-blue-700 font-bold rounded-lg transition-colors">Generate Analysis</button>
          </div>
        )}
      </div>
    </div>
  );
};
