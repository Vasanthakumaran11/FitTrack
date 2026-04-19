import { useNavigate } from 'react-router-dom';
import { useCalories } from '../hooks/useCalories';
import { useSleep } from '../hooks/useSleep';
import { useStress } from '../hooks/useStress';
import { useScore } from '../hooks/useScore';
import { DashboardCard, ScoreCard } from '../components/Dashboard/DashboardCard';
import { formatDataForAnalysis, clearHealthData } from '../utils/storageUtils';
import { toast } from 'react-toastify';

export const AnalysisDashboard = () => {
  const navigate = useNavigate();

  const healthData = formatDataForAnalysis();

  const calories = useCalories(healthData);
  const sleep = useSleep(healthData);
  const stress = useStress(healthData);
  const score = useScore(healthData);

  const healthyBenchmarks = {
    caloriesIntake: 2200,
    caloriesBurned: 300,
    sleepHours: 8,
    exerciseMinutes: 60,
    waterIntake: 3.5,
    protein: 150,
    carbs: 250,
    fat: 70
  };

  const calculateNutrition = () => {
    const nutrition = { protein: 0, carbs: 0, fat: 0, water: 0 };
    if (healthData.food) {
      Object.values(healthData.food).forEach(meal => {
        if (meal.totals) {
          nutrition.protein += meal.totals.protein || 0;
          nutrition.carbs += meal.totals.carbs || 0;
          nutrition.fat += meal.totals.fat || 0;
        }
        if (meal.waterIntake) {
          nutrition.water += meal.waterIntake;
        }
      });
    }
    return nutrition;
  };

  const nutrition = calculateNutrition();

  const calculateExerciseAnalysis = () => {
    const analysis = { totalMinutes: 0, totalCalories: 0, activities: [] };
    if (healthData.jogging?.duration) {
      analysis.totalMinutes += healthData.jogging.duration;
      analysis.totalCalories += healthData.jogging.caloriesBurned || 0;
      analysis.activities.push({ name: 'Jogging', minutes: healthData.jogging.duration, calories: healthData.jogging.caloriesBurned });
    }
    if (healthData.gym?.duration) {
      analysis.totalMinutes += healthData.gym.duration;
      analysis.totalCalories += healthData.gym.caloriesBurned || 0;
      analysis.activities.push({ name: 'Gym', minutes: healthData.gym.duration, calories: healthData.gym.caloriesBurned });
    }
    if (healthData.yoga?.duration) {
      analysis.totalMinutes += healthData.yoga.duration;
      analysis.totalCalories += (healthData.yoga.duration * 4) || 0;
      analysis.activities.push({ name: 'Yoga', minutes: healthData.yoga.duration, calories: healthData.yoga.duration * 4 });
    }
    return analysis;
  };

  const exerciseAnalysis = calculateExerciseAnalysis();

  const generateRecommendations = () => {
    const recs = { do: [], avoid: [], improvements: [] };
    
    if (calories.caloriesIntake > healthyBenchmarks.caloriesIntake + 500) {
      recs.avoid.push("Reduce calorie intake, currently above baseline.");
      recs.do.push("Focus on portion control and nutrient-dense foods.");
    } else if (calories.caloriesIntake < healthyBenchmarks.caloriesIntake - 500) {
      recs.do.push("Increase calorie intake slightly for better energy.");
    }

    if (exerciseAnalysis.totalMinutes < 30) {
      recs.do.push("Aim for at least 30 minutes of physical activity.");
      recs.improvements.push("Incorporate a brisk walk into your routine.");
    } else if (exerciseAnalysis.totalMinutes > 120) {
      recs.avoid.push("Avoid over-exercising; allow for adequate recovery.");
    }

    if (sleep.sleepHours < 7) {
      recs.do.push("Prioritize 7-9 hours of consistent sleep.");
      recs.improvements.push("Establish a pre-sleep relaxation routine.");
    }

    if (nutrition.protein < 100) recs.do.push("Increase protein intake.");
    if (nutrition.water < 2.5) recs.do.push("Drink more water (aim for 3L).");
    if (nutrition.fat > 100) recs.avoid.push("Reduce saturated fat intake.");

    if (!healthData.jogging?.duration && !healthData.gym?.duration) {
      recs.do.push("Include cardio exercises like jogging.");
    }
    if (!healthData.yoga?.duration) {
      recs.do.push("Consider yoga or stretching for flexibility.");
    }

    return recs;
  };

  const recommendations = generateRecommendations();

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      clearHealthData();
      toast.success('Data cleared');
      navigate('/');
    }
  };

  const handleStartOver = () => {
    if (window.confirm('Start a new day? This clears all current records.')) {
      clearHealthData();
      toast.success('Ready for a new day');
      navigate('/');
    }
  };

  const BarChart = ({ data, title }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-24 text-sm font-medium text-gray-600">{item.label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${item.color}`}
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              ></div>
            </div>
            <div className="w-16 text-sm font-semibold text-gray-800 text-right">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 py-12 px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Health Analysis
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Comprehensive insights and personalized recommendations based on your logs.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 space-y-10">
        <div className="mb-10">
          <ScoreCard
            score={score.overallScore}
            grade={score.healthGrade}
            message={score.healthMessage}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart
            title="Calorie Balance"
            data={[
              { label: 'Intake', value: `${calories.caloriesIntake}`, percentage: (calories.caloriesIntake / (healthyBenchmarks.caloriesIntake * 1.5)) * 100, color: 'bg-blue-600' },
              { label: 'Target', value: `${healthyBenchmarks.caloriesIntake}`, percentage: (healthyBenchmarks.caloriesIntake / (healthyBenchmarks.caloriesIntake * 1.5)) * 100, color: 'bg-gray-400' }
            ]}
          />
          <BarChart
            title="Exercise Duration"
            data={[
              { label: 'Current', value: `${exerciseAnalysis.totalMinutes}m`, percentage: (exerciseAnalysis.totalMinutes / 120) * 100, color: 'bg-blue-600' },
              { label: 'Target', value: '60m', percentage: 50, color: 'bg-gray-400' }
            ]}
          />
          <BarChart
            title="Sleep Schedule"
            data={[
              { label: 'Logged', value: `${sleep.sleepHours}h`, percentage: (sleep.sleepHours / 12) * 100, color: 'bg-indigo-600' },
              { label: 'Target', value: '8h', percentage: (8 / 12) * 100, color: 'bg-gray-400' }
            ]}
          />
          <BarChart
            title="Daily Nutrition"
            data={[
              { label: 'Protein', value: `${nutrition.protein}g`, percentage: (nutrition.protein / 200) * 100, color: 'bg-green-600' },
              { label: 'Carbs', value: `${nutrition.carbs}g`, percentage: (nutrition.carbs / 300) * 100, color: 'bg-yellow-500' },
              { label: 'Fat', value: `${nutrition.fat}g`, percentage: (nutrition.fat / 100) * 100, color: 'bg-red-500' }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Calories Burned" value={exerciseAnalysis.totalCalories} unit="cal" />
          <DashboardCard title="Calories Intake" value={calories.caloriesIntake} unit="cal" />
          <DashboardCard title="Water Intake" value={nutrition.water} unit="L" status={nutrition.water >= 3 ? 'Good' : 'Low'} />
          <DashboardCard title="Sleep Duration" value={sleep.sleepHours} unit="hours" status={sleep.sleepStatus} progress={sleep.sleepScore} />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Macro Nutrients</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="text-center py-4 md:py-0">
              <div className="text-3xl font-bold text-gray-800">{nutrition.protein}g</div>
              <div className="text-sm font-medium text-gray-600 mt-2">Protein</div>
              <div className="text-sm text-gray-500 mt-1">{nutrition.protein >= 120 ? 'Good intake' : 'Needs improvement'}</div>
            </div>
            <div className="text-center py-4 md:py-0">
              <div className="text-3xl font-bold text-gray-800">{nutrition.carbs}g</div>
              <div className="text-sm font-medium text-gray-600 mt-2">Carbs</div>
              <div className="text-sm text-gray-500 mt-1">{nutrition.carbs >= 200 ? 'Balanced' : 'Low'}</div>
            </div>
            <div className="text-center py-4 md:py-0">
              <div className="text-3xl font-bold text-gray-800">{nutrition.fat}g</div>
              <div className="text-sm font-medium text-gray-600 mt-2">Fats</div>
              <div className="text-sm text-gray-500 mt-1">{nutrition.fat <= 80 ? 'Balanced' : 'High'}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-green-800 mb-4">To Do</h3>
            <ul className="space-y-3">
              {recommendations.do.map((rec, i) => (
                <li key={i} className="text-sm text-green-900 flex items-start">
                  <span className="text-green-600 mr-2">•</span> {rec}
                </li>
              ))}
              {recommendations.do.length === 0 && <li className="text-sm text-green-700">No specific actions needed.</li>}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-red-800 mb-4">To Avoid</h3>
            <ul className="space-y-3">
              {recommendations.avoid.map((rec, i) => (
                <li key={i} className="text-sm text-red-900 flex items-start">
                  <span className="text-red-500 mr-2">•</span> {rec}
                </li>
              ))}
              {recommendations.avoid.length === 0 && <li className="text-sm text-red-700">No major concerns found.</li>}
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-blue-800 mb-4">Improvements</h3>
            <ul className="space-y-3">
              {recommendations.improvements.map((rec, i) => (
                <li key={i} className="text-sm text-blue-900 flex items-start">
                  <span className="text-blue-500 mr-2">•</span> {rec}
                </li>
              ))}
              {recommendations.improvements.length === 0 && <li className="text-sm text-blue-700">Routine looks balanced.</li>}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Score Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-gray-800">{Math.round(score.breakdownScores.calorieBalance)}</div>
              <div className="text-sm font-medium text-gray-600 mt-1">Calories (30%)</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: `${score.breakdownScores.calorieBalance}%`}}></div>
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-gray-800">{Math.round(score.breakdownScores.sleep)}</div>
              <div className="text-sm font-medium text-gray-600 mt-1">Sleep (30%)</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-indigo-600 h-2 rounded-full" style={{width: `${score.breakdownScores.sleep}%`}}></div>
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-gray-800">{Math.round(score.breakdownScores.yoga)}</div>
              <div className="text-sm font-medium text-gray-600 mt-1">Mind (20%)</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: `${score.breakdownScores.yoga}%`}}></div>
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-gray-800">{Math.round(score.breakdownScores.stress)}</div>
              <div className="text-sm font-medium text-gray-600 mt-1">Stress (20%)</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-green-600 h-2 rounded-full" style={{width: `${score.breakdownScores.stress}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleStartOver}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Start New Day
          </button>
          <button
            onClick={handleClearData}
            className="px-6 py-2.5 bg-white border border-red-300 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition-colors"
          >
            Clear Data
          </button>
        </div>
      </div>
    </div>
  );
};
