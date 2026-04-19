/**
 * localStorage Utility for Health Data Management
 */

const HEALTH_DATA_KEY = "healthData";

/**
 * Get all health data from localStorage
 */
export const getHealthData = () => {
  const data = localStorage.getItem(HEALTH_DATA_KEY);
  return data ? JSON.parse(data) : {};
};

/**
 * Save specific module data (exercise or food)
 */
export const saveModuleData = (moduleName, moduleData) => {
  const allData = getHealthData();

  // Determine category
  const isExercise = ["Jogging", "Gym", "Yoga", "Sleep"].includes(moduleName);
  const isFood = ["BreakFast", "Lunch", "Dinner", "Snack"].includes(moduleName);

  if (isExercise) {
    if (!allData.exercise) allData.exercise = {};
    allData.exercise[moduleName.toLowerCase()] = moduleData;
  } else if (isFood) {
    if (!allData.food) allData.food = {};
    const foodKey = moduleName === "BreakFast" ? "breakfast" : moduleName.toLowerCase();
    allData.food[foodKey] = moduleData;
  }

  localStorage.setItem(HEALTH_DATA_KEY, JSON.stringify(allData));
  return allData;
};

/**
 * Get data for a specific module
 */
export const getModuleData = (moduleName) => {
  const allData = getHealthData();
  const isExercise = ["Jogging", "Gym", "Yoga", "Sleep"].includes(moduleName);
  const isFood = ["BreakFast", "Lunch", "Dinner", "Snack"].includes(moduleName);

  if (isExercise) {
    return allData.exercise?.[moduleName.toLowerCase()] || null;
  } else if (isFood) {
    const foodKey = moduleName === "BreakFast" ? "breakfast" : moduleName.toLowerCase();
    return allData.food?.[foodKey] || null;
  }

  return null;
};

/**
 * Clear all health data
 */
export const clearHealthData = () => {
  localStorage.removeItem(HEALTH_DATA_KEY);
};

/**
 * Clear specific module data
 */
export const clearModuleData = (moduleName) => {
  const allData = getHealthData();
  const isExercise = ["Jogging", "Gym", "Yoga", "Sleep"].includes(moduleName);
  const isFood = ["BreakFast", "Lunch", "Dinner", "Snack"].includes(moduleName);

  if (isExercise && allData.exercise) {
    delete allData.exercise[moduleName.toLowerCase()];
  } else if (isFood && allData.food) {
    const foodKey = moduleName === "BreakFast" ? "breakfast" : moduleName.toLowerCase();
    delete allData.food[foodKey];
  }

  localStorage.setItem(HEALTH_DATA_KEY, JSON.stringify(allData));
};

/**
 * Format data for analysis
 * Returns data in a structured format for hooks
 */
export const formatDataForAnalysis = () => {
  const allData = getHealthData();
  
  return {
    jogging: allData.exercise?.jogging || {},
    gym: allData.exercise?.gym || {},
    yoga: allData.exercise?.yoga || {},
    sleep: allData.exercise?.sleep || {},
    food: {
      breakfast: allData.food?.breakfast || {},
      lunch: allData.food?.lunch || {},
      dinner: allData.food?.dinner || {},
      snack: allData.food?.snack || {}
    }
  };
};
