import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalories } from '../hooks/useCalories';
import { useSleep } from '../hooks/useSleep';
import { useScore } from '../hooks/useScore';
import { DashboardCard, ScoreCard } from '../components/Dashboard/DashboardCard';
import { UserContext } from '../context/UserContext';
import { activityApi } from '../utils/api';
import { toast } from 'react-toastify';

export const AnalysisDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [healthData, setHealthData] = useState({ exercise: {}, food: {} });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await activityApi.fetch(user.id);
        if (response.success && response.data) {
          const aggregated = {
            jogging: { duration: 0, caloriesBurned: 0 },
            gym: { duration: 0, caloriesBurned: 0 },
            gymVolume: {},
            yoga: { duration: 0, caloriesBurned: 0 },
            sleep: { sleepHours: 0 },
            food: { breakfast: { totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, waterIntake: 0 }, lunch: { totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, waterIntake: 0 }, dinner: { totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, waterIntake: 0 }, snack: { totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, waterIntake: 0 } }
          };

          // Basic count for averaging if needed
          const totalDays = response.data.length || 1;

          const junkItems = [];

          response.data.forEach(day => {
            if (day.exercise?.jogging) {
              aggregated.jogging.duration += day.exercise.jogging.duration || 0;
              aggregated.jogging.caloriesBurned += day.exercise.jogging.caloriesBurned || 0;
            }
            if (day.exercise?.gym) {
              aggregated.gym.duration += day.exercise.gym.duration || 0;
              aggregated.gym.caloriesBurned += day.exercise.gym.caloriesBurned || 0;
              
              if (Array.isArray(day.exercise.gym.selectedExercises)) {
                day.exercise.gym.selectedExercises.forEach(ex => {
                  const name = typeof ex === 'string' ? ex : ex.name;
                  const count = typeof ex === 'string' ? 0 : (ex.count || 0);
                  if (name) {
                    aggregated.gymVolume[name] = (aggregated.gymVolume[name] || 0) + count;
                  }
                });
              }
            }
            if (day.exercise?.yoga) {
              aggregated.yoga.duration += day.exercise.yoga.duration || 0;
              aggregated.yoga.caloriesBurned += (day.exercise.yoga.duration * 4) || 0;
            }
            if (day.exercise?.sleep) {
              aggregated.sleep.sleepHours += day.exercise.sleep.sleepHours || 0;
            }

            ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
              const meal = day.food?.[mealType];
              if (meal?.totals) {
                aggregated.food[mealType].totals.calories += meal.totals.calories || 0;
                aggregated.food[mealType].totals.protein += meal.totals.protein || 0;
                aggregated.food[mealType].totals.carbs += meal.totals.carbs || 0;
                aggregated.food[mealType].totals.fat += meal.totals.fat || 0;
              }
              if (meal?.waterIntake) aggregated.food[mealType].waterIntake += meal.waterIntake;
              
              meal?.selectedFoods?.forEach(f => {
                if (f.category === 'junk') junkItems.push(f.name);
              });
            });

          });


          setHealthData({
            jogging: { 
              duration: Math.round(aggregated.jogging.duration / totalDays), 
              caloriesBurned: Math.round(aggregated.jogging.caloriesBurned / totalDays) 
            },
            gym: { 
              duration: Math.round(aggregated.gym.duration / totalDays), 
              caloriesBurned: Math.round(aggregated.gym.caloriesBurned / totalDays) 
            },
            gymVolume: aggregated.gymVolume,
            yoga: { 
              duration: Math.round(aggregated.yoga.duration / totalDays), 
              asanasDone: Math.round(aggregated.yoga.asanasDone / totalDays) 
            },
            sleep: { sleepHours: Math.round(aggregated.sleep.sleepHours / totalDays * 10) / 10 },
            food: {
              breakfast: { totals: { 
                calories: Math.round(aggregated.food.breakfast.totals.calories / totalDays),
                protein: Math.round(aggregated.food.breakfast.totals.protein / totalDays),
                carbs: Math.round(aggregated.food.breakfast.totals.carbs / totalDays),
                fat: Math.round(aggregated.food.breakfast.totals.fat / totalDays)
              }, waterIntake: Math.round(aggregated.food.breakfast.waterIntake / totalDays * 10) / 10 },
              lunch: { totals: { 
                calories: Math.round(aggregated.food.lunch.totals.calories / totalDays),
                protein: Math.round(aggregated.food.lunch.totals.protein / totalDays),
                carbs: Math.round(aggregated.food.lunch.totals.carbs / totalDays),
                fat: Math.round(aggregated.food.lunch.totals.fat / totalDays)
              }, waterIntake: Math.round(aggregated.food.lunch.waterIntake / totalDays * 10) / 10 },
              dinner: { totals: { 
                calories: Math.round(aggregated.food.dinner.totals.calories / totalDays),
                protein: Math.round(aggregated.food.dinner.totals.protein / totalDays),
                carbs: Math.round(aggregated.food.dinner.totals.carbs / totalDays),
                fat: Math.round(aggregated.food.dinner.totals.fat / totalDays)
              }, waterIntake: Math.round(aggregated.food.dinner.waterIntake / totalDays * 10) / 10 },
              snack: { totals: { 
                calories: Math.round(aggregated.food.snack.totals.calories / totalDays),
                protein: Math.round(aggregated.food.snack.totals.protein / totalDays),
                carbs: Math.round(aggregated.food.snack.totals.carbs / totalDays),
                fat: Math.round(aggregated.food.snack.totals.fat / totalDays)
              }, waterIntake: Math.round(aggregated.food.snack.waterIntake / totalDays * 10) / 10 },
            },
            totalDays,
            junkItems: [...new Set(junkItems)]
          });
        }
      } catch {
        toast.error("Analysis failed");
      }
    };
    fetchData();
  }, [user.id]);

  const calories = useCalories(healthData);
  const sleep = useSleep(healthData);
  const score = useScore(healthData);

  const calculateNutrition = () => {
    const nutrition = { protein: 0, carbs: 0, fat: 0, water: 0 };
    if (healthData.food) {
      Object.values(healthData.food).forEach(meal => {
        if (meal.totals) {
          nutrition.protein += meal.totals.protein || 0;
          nutrition.carbs += meal.totals.carbs || 0;
          nutrition.fat += meal.totals.fat || 0;
        }
        if (meal.waterIntake) nutrition.water += meal.waterIntake;
      });
    }
    return nutrition;
  };

  const nutrition = calculateNutrition();

  const handleClearData = async () => {
    if (!window.confirm("Are you sure you want to PERMANENTLY delete all your activity data? This cannot be undone.")) return;
    
    try {
      await activityApi.clearHistory(user.id);
      toast.success("All data cleared successfully");
      setHealthData({ 
        jogging: { duration: 0, caloriesBurned: 0 },
        gym: { duration: 0, caloriesBurned: 0 },
        gymVolume: {},
        yoga: { duration: 0, caloriesBurned: 0 },
        sleep: { sleepHours: 0 },
        food: { breakfast: { totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, waterIntake: 0 }, lunch: { totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, waterIntake: 0 }, dinner: { totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, waterIntake: 0 }, snack: { totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, waterIntake: 0 } },
        totalDays: 0,
        junkItems: []
      });
    } catch {
      toast.error("Failed to clear data");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 py-12 px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Analysis</h1>
        <p className="text-gray-600 max-w-xl mx-auto">Comprehensive insights based on behavioral quality and daily averages.</p>
      </div>

      <div className="w-[95%] lg:w-[90%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 mt-10 space-y-10">
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          <div className="flex-1">
            <ScoreCard 
              score={score.overallScore} 
              grade={score.healthGrade} 
              message={score.healthMessage} 
            />
          </div>
          <div className="w-full md:w-64 bg-white border rounded-xl p-8 shadow-sm flex flex-col items-center justify-center">
            <div className="text-gray-500 font-medium text-sm mb-1">Consistency Tracker</div>
            <div className="text-5xl font-extrabold text-blue-600">{healthData.totalDays || 0}</div>
            <div className="text-xs text-gray-400 mt-2 uppercase font-bold tracking-tighter text-center">Days Logged</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Avg. Calories Burned" value={Math.round((healthData.jogging?.caloriesBurned || 0) + (healthData.gym?.caloriesBurned || 0))} unit="cal" />
          <DashboardCard title="Avg. Calories Intake" value={calories.caloriesIntake} unit="cal" />
          <DashboardCard title="Avg. Water Intake" value={nutrition.water} unit="L" status={nutrition.water >= 3 ? 'Good' : 'Low'} />
          <DashboardCard title="Avg. Sleep Duration" value={sleep.sleepHours} unit="hours" status={sleep.sleepStatus} progress={sleep.sleepScore} />
        </div>


        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Daily Average Nutrients</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x">
            <div className="text-center py-4">
              <div className="text-3xl font-bold">{nutrition.protein}g</div>
              <div className="text-sm font-medium text-gray-600 mt-2">Protein</div>
            </div>
            <div className="text-center py-4">
              <div className="text-3xl font-bold">{nutrition.carbs}g</div>
              <div className="text-sm font-medium text-gray-600 mt-2">Carbs</div>
            </div>
            <div className="text-center py-4">
              <div className="text-3xl font-bold">{nutrition.fat}g</div>
              <div className="text-sm font-medium text-gray-600 mt-2">Fats</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Health Scores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x">
            <div className="text-center p-4 flex flex-col items-center">
              <div className="text-4xl font-bold text-indigo-600">{score.physicalScore}</div>
              <div className="text-lg font-medium mt-2">Physical Health</div>
              <div className="mt-4 px-4 text-indigo-700 bg-indigo-50 p-4 rounded-lg w-full">
                💡 {score.physicalScore < 60 ? "Increase activity and protein intake." : "Solid physical consistency!"}
              </div>
            </div>
            <div className="text-center p-4 flex flex-col items-center">
              <div className="text-4xl font-bold text-teal-600">{score.mentalScore}</div>
              <div className="text-lg font-medium mt-2">Mental Health</div>
              <div className="mt-4 px-4 text-teal-700 bg-teal-50 p-4 rounded-lg w-full">
                💡 {score.mentalScore < 60 ? "Prioritize sleep and mindfulness." : "Great mental balance!"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🧠</span> Actionable Health Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {score.insights.map((insight, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex items-start gap-3">
                  <span className="text-blue-200 mt-1">✦</span>
                  <span className="text-sm font-medium">{insight}</span>
                </div>
              ))}
              {score.insights.length === 0 && (
                <div className="col-span-full text-center py-4 text-blue-100 italic">
                  No critical items identified. You are maintaining a healthy balance!
                </div>
              )}
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-12 border-t border-dashed">
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Back to Dashboard
          </button>
          <button onClick={handleClearData} className="px-8 py-3 bg-red-50 text-red-600 border border-red-100 rounded-lg font-semibold hover:bg-red-100 transition-colors">
            Clear All My History
          </button>
        </div>
      </div>
    </div>
  );
};
