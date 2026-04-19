/**
 * useCalories Hook
 * Calculates calories burned and intake based on activities
 * 
 * Calorie burn rates:
 * - Jogging: 8 cal/min
 * - Gym: 10 cal/min
 * - Yoga: 4 cal/min
 */

export const useCalories = (data) => {
  const calculateBurned = () => {
    if (!data) return 0;

    const joggingMinutes = data.jogging?.duration || 0;
    const gymMinutes = data.gym?.duration || 0;
    const yogaMinutes = data.yoga?.duration || 0;

    return joggingMinutes * 8 + gymMinutes * 10 + yogaMinutes * 4;
  };

  const calculateIntake = () => {
    if (!data || !data.food) return 0;

    const breakfast = data.food?.breakfast?.calories || 0;
    const lunch = data.food?.lunch?.calories || 0;
    const dinner = data.food?.dinner?.calories || 0;
    const snacks = data.food?.snack?.calories || 0;

    return breakfast + lunch + dinner + snacks;
  };

  const getCalorieBalance = () => {
    const burned = calculateBurned();
    const intake = calculateIntake();
    return intake - burned;
  };

  return {
    caloriesBurned: calculateBurned(),
    caloriesIntake: calculateIntake(),
    calorieBalance: getCalorieBalance()
  };
};
