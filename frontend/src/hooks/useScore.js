/**
 * useScore Hook
 * Calculates overall health score based on:
 * - Calorie balance (30%)
 * - Sleep quality (30%)
 * - Yoga (20%)
 * - Stress level (20%)
 */

import { useCalories } from './useCalories';
import { useSleep } from './useSleep';
import { useStress } from './useStress';

export const useScore = (data) => {
  const { caloriesBurned, caloriesIntake, calorieBalance } = useCalories(data);
  const { sleepStatus, sleepScore } = useSleep(data);
  const { stressScore } = useStress(data);

  const getYogaScore = () => {
    const yogaMinutes = data?.yoga?.duration || 0;
    const asanasDone = data?.yoga?.asanasDone || 0;

    // Max 30 minutes and 5+ asanas for perfect score
    const yogaDurationScore = Math.min((yogaMinutes / 30) * 100, 100);
    const asanaScore = Math.min((asanasDone / 5) * 100, 100);

    return (yogaDurationScore + asanaScore) / 2;
  };

  const getCalorieBalanceScore = () => {
    // Ideal balance is around 0 (eat what you burn)
    // Score decreases as imbalance increases
    const deficit = Math.abs(calorieBalance);
    
    if (deficit === 0) return 100;
    if (deficit <= 200) return 80;
    if (deficit <= 500) return 60;
    if (deficit <= 1000) return 40;
    return 20;
  };

  const calculateOverallScore = () => {
    const calorieScore = getCalorieBalanceScore();
    const yogaScore = getYogaScore();

    // Weighted calculation
    const overallScore = 
      (calorieScore * 0.3) +
      (sleepScore * 0.3) +
      (yogaScore * 0.2) +
      (stressScore * 0.2);

    return Math.round(overallScore);
  };

  const getHealthGrade = () => {
    const score = calculateOverallScore();
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  const getHealthMessage = () => {
    const grade = getHealthGrade();
    const messages = {
      "A+": "Excellent! You're in great shape! 🎉",
      "A": "Great job! Keep maintaining this routine! 👏",
      "B": "Good effort! There's room for improvement. 💪",
      "C": "You're doing okay, but try to improve. 📈",
      "D": "You need to focus more on your health. ⚠️",
      "F": "Your health needs serious attention. 🚨"
    };
    return messages[grade];
  };

  return {
    overallScore: calculateOverallScore(),
    healthGrade: getHealthGrade(),
    healthMessage: getHealthMessage(),
    breakdownScores: {
      calorieBalance: getCalorieBalanceScore(),
      sleep: sleepScore,
      yoga: getYogaScore(),
      stress: stressScore
    }
  };
};
