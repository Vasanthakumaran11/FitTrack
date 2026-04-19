/**
 * useStress Hook
 * Determines stress level based on yoga and sleep quality
 * 
 * Stress Levels:
 * - High: Low yoga & low sleep
 * - Low: Good yoga & good sleep
 * - Moderate: Otherwise
 */

import { useSleep } from './useSleep';

export const useStress = (data) => {
  const { sleepStatus } = useSleep(data);

  const getYogaMinutes = () => {
    return data?.yoga?.duration || 0;
  };

  const getStressLevel = () => {
    const yogaMinutes = getYogaMinutes();
    const isGoodSleep = sleepStatus === "Good";
    const isGoodYoga = yogaMinutes >= 20;

    if (!isGoodSleep && !isGoodYoga) return "High";
    if (isGoodSleep && isGoodYoga) return "Low";
    return "Moderate";
  };

  const getStressScore = () => {
    const level = getStressLevel();
    if (level === "Low") return 90;
    if (level === "Moderate") return 60;
    return 30;
  };

  return {
    stressLevel: getStressLevel(),
    stressScore: getStressScore(),
    recommendation: getStressLevel() === "High" ? "Try more yoga and better sleep" : "Keep it up!"
  };
};
