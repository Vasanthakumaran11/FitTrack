import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Activities from '../components/Home/activities';
import { getHealthData } from '../utils/storageUtils';

export const HomePage = () => {
  const navigate = useNavigate();
  const [hasData, setHasData] = useState(false);
  const [stats, setStats] = useState({
    totalCalories: 0,
    totalExercises: 0,
    totalSleep: 0,
    lastUpdated: null
  });

  useEffect(() => {
    const healthData = getHealthData();
    const hasAnyData = healthData?.exercise || healthData?.food;
    setHasData(!!hasAnyData);

    if (healthData) {
      let totalCalories = 0;
      let totalExercises = 0;
      let totalSleep = 0;
      let lastUpdated = null;

      if (healthData.food) {
        Object.values(healthData.food).forEach(dayData => {
          if (dayData.totals) totalCalories += dayData.totals.calories || 0;
        });
      }

      if (healthData.exercise) {
        Object.values(healthData.exercise).forEach(dayData => {
          if (dayData.caloriesBurned) {
            totalCalories -= dayData.caloriesBurned;
            totalExercises += 1;
          }
          if (dayData.sleepHours) totalSleep += dayData.sleepHours;
        });
      }

      const allData = [];
      if (healthData.food) allData.push(...Object.values(healthData.food));
      if (healthData.exercise) allData.push(...Object.values(healthData.exercise));

      if (allData.length > 0) {
        lastUpdated = allData
          .filter(item => item.timestamp)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]?.timestamp;
      }

      setStats({
        totalCalories: Math.max(0, totalCalories),
        totalExercises,
        totalSleep: Math.round(totalSleep * 10) / 10,
        lastUpdated
      });
    }
  }, []);

  const activities = [
    { img: "sleep.avif", work: "Sleep", desc: "Track your sleep hours" },
    { img: "Gym-1.jpg", work: "Gym", desc: "Log your gym workouts" },
    { img: "images.jpg", work: "Yoga", desc: "Record your yoga sessions" },
    { img: "jogging.webp", work: "Jogging", desc: "Track your jogging time" },
    { img: "bk-1.jpg", work: "BreakFast", desc: "Log breakfast details" },
    { img: "lunch-1.jpg", work: "Lunch", desc: "Record lunch items" },
    { img: "dinner.jpg", work: "Dinner", desc: "Add dinner information" },
    { img: "snack.jpg", work: "Snack", desc: "Log your snacks" }
  ];

  const quickStats = [
    { label: "Net Calories", value: stats.totalCalories, unit: "cal" },
    { label: "Workouts", value: stats.totalExercises, unit: "sessions" },
    { label: "Sleep", value: stats.totalSleep, unit: "hrs" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3 text-gray-900">
            Health Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive overview of your daily habits. Track activities, monitor nutrition, and optimize your routine easily.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        {/* Quick Stats Section */}
        {hasData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-8 relative z-10 mb-12">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="text-gray-600 font-medium mb-1">{stat.label}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-blue-600">{stat.value}</span>
                  <span className="text-gray-500 font-medium">{stat.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Activities Grid */}
        <section className={hasData ? "" : "mt-12"}>
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
            <p className="text-gray-600 mt-1">Select an activity below to update your daily records.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {activities.map((activity, index) => (
              <Activities
                key={index}
                img={activity.img}
                work={activity.work}
                desc={activity.desc}
              />
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        {hasData ? (
          <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between shadow-lg">
            <div className="md:max-w-xl mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white mb-2">
                Review Your Progress
              </h2>
              <p className="text-blue-100 text-lg">
                View detailed analysis, patterns, and personalized insights based on your recent activity data.
              </p>
              {stats.lastUpdated && (
                <p className="text-sm text-blue-200 mt-3">
                  Last updated: {new Date(stats.lastUpdated).toLocaleDateString()}
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('/analysis')}
              className="px-6 py-3 bg-white text-blue-700 hover:bg-gray-50 font-semibold rounded-lg text-lg transition-colors shadow-sm w-full md:w-auto"
            >
              Generate Analysis
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              No Data Found
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start your journey today by logging your first meal or workout session from the activities above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
