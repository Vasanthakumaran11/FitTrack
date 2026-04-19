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
  const lowerName = moduleName.toLowerCase();

  // Determine category
  const isExercise = ["jogging", "gym", "yoga", "sleep"].includes(lowerName);
  const isFood = ["breakfast", "lunch", "dinner", "snack"].includes(lowerName);

  if (isExercise) {
    if (!allData.exercise) allData.exercise = {};
    allData.exercise[lowerName] = moduleData;
  } else if (isFood) {
    if (!allData.food) allData.food = {};
    allData.food[lowerName] = moduleData;
  }

  localStorage.setItem(HEALTH_DATA_KEY, JSON.stringify(allData));
  return allData;
};

/**
 * Get data for a specific module
 */
export const getModuleData = (moduleName) => {
  const allData = getHealthData();
  const lowerName = moduleName.toLowerCase();
  
  const isExercise = ["jogging", "gym", "yoga", "sleep"].includes(lowerName);
  const isFood = ["breakfast", "lunch", "dinner", "snack"].includes(lowerName);

  if (isExercise) {
    return allData.exercise?.[lowerName] || null;
  } else if (isFood) {
    return allData.food?.[lowerName] || null;
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
  const lowerName = moduleName.toLowerCase();
  
  const isExercise = ["jogging", "gym", "yoga", "sleep"].includes(lowerName);
  const isFood = ["breakfast", "lunch", "dinner", "snack"].includes(lowerName);

  if (isExercise && allData.exercise) {
    delete allData.exercise[lowerName];
  } else if (isFood && allData.food) {
    delete allData.food[lowerName];
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
