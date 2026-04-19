export const useScore = (data) => {
  if (!data || data.totalDays === 0) {
    return {
      message: "No data available",
      overallScore: null,
      healthGrade: "N/A",
      physicalScore: 0,
      mentalScore: 0,
      insights: ["Log your first activity to see results!"]
    };
  }

  const calculatePhysicalScore = () => {
    let activityScore = 0;
    const jogging = data.jogging?.duration || 0;
    const gym = data.gym?.duration || 0;

    // Activity (40)
    if (jogging >= 30) activityScore += 20;
    else if (jogging >= 15) activityScore += 10;

    if (gym >= 30) activityScore += 20;
    else if (gym >= 15) activityScore += 10;

    // Nutrition (40)
    let nutritionScore = 0;
    const totals = {
      cal: 0, protein: 0
    };
    
    // Average food data
    if (data.food) {
      Object.values(data.food).forEach(meal => {
        if (meal.totals) {
          totals.cal += meal.totals.calories || 0;
          totals.protein += meal.totals.protein || 0;
        }
      });
    }

    if (totals.cal >= 1800 && totals.cal <= 2500) nutritionScore += 15;
    else if (totals.cal >= 1500) nutritionScore += 10;

    if (totals.protein >= 60) nutritionScore += 15;
    else if (totals.protein >= 40) nutritionScore += 10;

    const junkCount = data.junkItems?.length || 0;
    if (junkCount === 0) nutritionScore += 10;
    else if (junkCount <= 2) nutritionScore += 5;

    // Consistency (20)
    const consistencyScore = Math.min((data.totalDays || 0) * 2, 20);

    return Math.min(100, activityScore + nutritionScore + consistencyScore);
  };

  // --- MENTAL HEALTH (100) ---
  const calculateMentalScore = () => {
    let sleepScore = 0;
    const sleepVal = data.sleep?.sleepHours;

    // Sleep (50)
    if (sleepVal >= 7 && sleepVal <= 8) sleepScore = 50;
    else if (sleepVal >= 6) sleepScore = 35;
    else if (sleepVal !== null && sleepVal !== undefined) sleepScore = 15;

    // Mindfulness (50)
    let mindfulnessScore = 0;
    const mindfulness = data.yoga?.duration;
    if (mindfulness >= 20) mindfulnessScore = 50;
    else if (mindfulness >= 10) mindfulnessScore = 35;
    else if (mindfulness !== null && mindfulness !== undefined) mindfulnessScore = 15;

    return Math.min(100, sleepScore + mindfulnessScore);
  };

  const pScore = calculatePhysicalScore();
  const mScore = calculateMentalScore();

  const overallScore = Math.round((pScore * 0.6) + (mScore * 0.4));

  const getHealthGrade = (score) => {
    if (score >= 80) return "A";
    if (score >= 65) return "B";
    if (score >= 50) return "C";
    return "D";
  };

  const generateInsights = () => {
    const insights = [];
    const sleep = data.sleep?.sleepHours;
    const mindfulness = data.yoga?.duration || 0;
    
    let protein = 0;
    if (data.food) {
      Object.values(data.food).forEach(meal => {
        if (meal.totals) protein += meal.totals.protein || 0;
      });
    }

    if (sleep < 6 && mindfulness < 10) insights.push("High stress detected");
    if (protein < 40) insights.push("Increase protein intake");
    if ((data.jogging?.duration || 0) < 15) insights.push("Increase physical activity");

    return insights;
  };

  return {
    physicalScore: pScore,
    mentalScore: mScore,
    overallScore,
    healthGrade: getHealthGrade(overallScore),
    insights: generateInsights(),
    healthMessage: `Overall physical and mental balance: ${getHealthGrade(overallScore)} Grade`
  };
};
