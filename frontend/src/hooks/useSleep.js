/**
 * useSleep Hook
 * Determines sleep quality based on hours slept
 * 
 * Sleep Status:
 * - Poor: < 6 hours
 * - Good: 6-8 hours
 * - Oversleep: > 8 hours
 */

export const useSleep = (data) => {
  const calculateSleepHours = () => {
    if (!data || !data.sleep) return 0;

    const bedTime = new Date(`2000-01-01 ${data.sleep.bedTime}`);
    const wakeTime = new Date(`2000-01-01 ${data.sleep.wakeTime}`);

    if (wakeTime < bedTime) {
      // If wake time is next day
      wakeTime.setDate(wakeTime.getDate() + 1);
    }

    const diffMs = wakeTime - bedTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.round(diffHours * 10) / 10; // Round to 1 decimal place
  };

  const getSleepStatus = () => {
    const hours = calculateSleepHours();
    
    if (hours < 6) return "Poor";
    if (hours >= 6 && hours <= 8) return "Good";
    if (hours > 8) return "Oversleep";
    return "No Data";
  };

  const sleepHours = calculateSleepHours();
  const status = getSleepStatus();

  return {
    sleepHours,
    sleepStatus: status,
    sleepScore: sleepHours === 0 ? 0 : Math.min((sleepHours / 8) * 100, 100)
  };
};
