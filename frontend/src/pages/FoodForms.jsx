import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { saveModuleData, getModuleData } from '../utils/storageUtils';

const FOOD_DATA = {
  breakfast: {
    'Idly (2 pieces)': { calories: 120, protein: 4, carbs: 25, fat: 1, category: 'healthy' },
    'Dosa (1 piece)': { calories: 180, protein: 5, carbs: 30, fat: 3, category: 'healthy' },
    'Poori (2 pieces)': { calories: 250, protein: 6, carbs: 35, fat: 8, category: 'oiled' },
    'Pongal': { calories: 220, protein: 7, carbs: 40, fat: 4, category: 'healthy' },
    'Upma': { calories: 160, protein: 5, carbs: 28, fat: 3, category: 'healthy' },
    'Paratha': { calories: 280, protein: 8, carbs: 35, fat: 10, category: 'oiled' },
    'Poha': { calories: 140, protein: 4, carbs: 26, fat: 2, category: 'healthy' },
    'Manual Entry': { calories: 0, protein: 0, carbs: 0, fat: 0, category: 'custom' }
  },
  lunch: {
    'Rice & Dal': { calories: 350, protein: 12, carbs: 65, fat: 5, category: 'healthy' },
    'Chicken Curry': { calories: 420, protein: 35, carbs: 20, fat: 15, category: 'protein' },
    'Fish Curry': { calories: 380, protein: 32, carbs: 15, fat: 12, category: 'protein' },
    'Paneer Curry': { calories: 400, protein: 25, carbs: 30, fat: 18, category: 'vegetarian' },
    'Mixed Vegetables': { calories: 280, protein: 8, carbs: 45, fat: 6, category: 'healthy' },
    'Biryani': { calories: 450, protein: 15, carbs: 70, fat: 12, category: 'carbs' },
    'Roti & Sabzi': { calories: 320, protein: 10, carbs: 50, fat: 8, category: 'healthy' },
    'Manual Entry': { calories: 0, protein: 0, carbs: 0, fat: 0, category: 'custom' }
  },
  dinner: {
    'Rice & Vegetables': { calories: 300, protein: 8, carbs: 55, fat: 4, category: 'healthy' },
    'Grilled Chicken': { calories: 280, protein: 40, carbs: 5, fat: 8, category: 'protein' },
    'Fish': { calories: 250, protein: 35, carbs: 3, fat: 6, category: 'protein' },
    'Dal & Roti': { calories: 320, protein: 12, carbs: 50, fat: 6, category: 'healthy' },
    'Salad': { calories: 150, protein: 5, carbs: 20, fat: 3, category: 'healthy' },
    'Soup': { calories: 120, protein: 6, carbs: 15, fat: 2, category: 'light' },
    'Oats': { calories: 180, protein: 7, carbs: 30, fat: 4, category: 'healthy' },
    'Manual Entry': { calories: 0, protein: 0, carbs: 0, fat: 0, category: 'custom' }
  },
  snack: {
    'Apple': { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, category: 'fruit' },
    'Banana': { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, category: 'fruit' },
    'Orange': { calories: 62, protein: 1.2, carbs: 15, fat: 0.2, category: 'fruit' },
    'Dates (5 pieces)': { calories: 115, protein: 1, carbs: 30, fat: 0.2, category: 'dry-fruit' },
    'Almonds (10 pieces)': { calories: 160, protein: 6, carbs: 6, fat: 14, category: 'nuts' },
    'Chips': { calories: 150, protein: 2, carbs: 15, fat: 10, category: 'junk' },
    'Chocolate': { calories: 200, protein: 3, carbs: 25, fat: 12, category: 'sweet' },
    'Biscuits': { calories: 120, protein: 2, carbs: 18, fat: 5, category: 'junk' },
    'Manual Entry': { calories: 0, protein: 0, carbs: 0, fat: 0, category: 'custom' }
  }
};

const FoodFormTemplate = ({ name, foodType }) => {
  return function FoodForm() {
    const navigate = useNavigate();
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [customFood, setCustomFood] = useState({ name: '', calories: '', quantity: '' });
    const [waterIntake, setWaterIntake] = useState('');
    const [showCustom, setShowCustom] = useState(false);

    useEffect(() => {
      const saved = getModuleData(name);
      if (saved) {
        setSelectedFoods(saved.selectedFoods || []);
        setCustomFood(saved.customFood || { name: '', calories: '', quantity: '' });
        setWaterIntake(saved.waterIntake || '');
      }
    }, [name]);

    const foodOptions = FOOD_DATA[foodType] || {};

    const handleFoodSelect = (foodName) => {
      if (foodName === 'Manual Entry') {
        setShowCustom(true);
        return;
      }

      const foodData = foodOptions[foodName];
      if (!foodData) return;

      const newFood = {
        name: foodName,
        ...foodData,
        quantity: 1,
        timestamp: new Date().toISOString()
      };

      setSelectedFoods(prev => {
        const existing = prev.find(f => f.name === foodName);
        if (existing) {
          return prev.map(f => f.name === foodName ? { ...f, quantity: f.quantity + 1 } : f);
        }
        return [...prev, newFood];
      });
    };

    const removeFood = (foodName) => {
      setSelectedFoods(prev => prev.filter(f => f.name !== foodName));
    };

    const updateQuantity = (foodName, newQuantity) => {
      setSelectedFoods(prev =>
        prev.map(f => f.name === foodName ? { ...f, quantity: Math.max(1, newQuantity) } : f)
      );
    };

    const addCustomFood = () => {
      if (!customFood.name || !customFood.calories) {
        toast.error('Please fill in food name and calories');
        return;
      }

      const newFood = {
        name: customFood.name,
        calories: parseInt(customFood.calories),
        protein: 0,
        carbs: 0,
        fat: 0,
        category: 'custom',
        quantity: parseInt(customFood.quantity) || 1,
        timestamp: new Date().toISOString()
      };

      setSelectedFoods(prev => [...prev, newFood]);
      setCustomFood({ name: '', calories: '', quantity: '' });
      setShowCustom(false);
      toast.success('Custom food added!');
    };

    const calculateTotals = () => {
      return selectedFoods.reduce((totals, food) => ({
        calories: totals.calories + (food.calories * food.quantity),
        protein: totals.protein + (food.protein * food.quantity),
        carbs: totals.carbs + (food.carbs * food.quantity),
        fat: totals.fat + (food.fat * food.quantity)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    };

    const handleSubmit = () => {
      if (selectedFoods.length === 0 && !waterIntake) {
        toast.error('Please select at least one food item or enter water intake');
        return;
      }

      const totals = calculateTotals();
      const dataToSave = {
        selectedFoods,
        customFood,
        waterIntake: waterIntake ? parseFloat(waterIntake) : 0,
        totals,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };

      saveModuleData(name, dataToSave);
      toast.success(`${name} logged successfully`);
      navigate('/');
    };

    const totals = calculateTotals();

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            {name} Log
          </h2>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Select Items</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.keys(foodOptions).map((foodName) => (
                <button
                  key={foodName}
                  onClick={() => handleFoodSelect(foodName)}
                  className={`p-3 rounded-md border transition-all text-sm font-medium ${
                    foodName === 'Manual Entry'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-gray-50 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  {foodName}
                </button>
              ))}
            </div>
          </div>

          {showCustom && (
            <div className="mb-8 p-5 bg-blue-50 rounded-md border border-blue-100">
              <h4 className="font-medium text-blue-900 mb-4">Add Custom Item</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Food name"
                  value={customFood.name}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <input
                  type="number"
                  placeholder="Calories"
                  value={customFood.calories}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, calories: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={customFood.quantity}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, quantity: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={addCustomFood}
                  className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Item
                </button>
                <button
                  onClick={() => setShowCustom(false)}
                  className="px-5 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {selectedFoods.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Selected Items</h3>
              <div className="space-y-3">
                {selectedFoods.map((food, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">{food.name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({food.calories * food.quantity} cal)
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-md bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(food.name, food.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-medium"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-gray-800">{food.quantity}</span>
                        <button
                          onClick={() => updateQuantity(food.name, food.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-medium"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFood(food.name)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {foodType === 'snack' && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Water Intake</h3>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Liters (e.g. 2.5)"
                  value={waterIntake}
                  onChange={(e) => setWaterIntake(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md w-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <span className="text-gray-600">Liters</span>
              </div>
            </div>
          )}

          {(selectedFoods.length > 0 || waterIntake) && (
            <div className="mb-8 p-5 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Nutrition Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{totals.calories}</div>
                  <div className="text-sm text-gray-500 mt-1">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totals.protein}g</div>
                  <div className="text-sm text-gray-500 mt-1">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totals.carbs}g</div>
                  <div className="text-sm text-gray-500 mt-1">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totals.fat}g</div>
                  <div className="text-sm text-gray-500 mt-1">Fat</div>
                </div>
              </div>
              {waterIntake && (
                <div className="mt-5 text-center border-t border-gray-200 pt-4">
                  <span className="text-blue-700 font-medium">{waterIntake}L water logged</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Form
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
};

export const BreakFastForm = FoodFormTemplate({ name: 'Breakfast', foodType: 'breakfast' });
export const LunchForm = FoodFormTemplate({ name: 'Lunch', foodType: 'lunch' });
export const DinnerForm = FoodFormTemplate({ name: 'Dinner', foodType: 'dinner' });
export const SnackForm = FoodFormTemplate({ name: 'Snack', foodType: 'snack' });
