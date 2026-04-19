import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import { activityApi } from '../../utils/api';
import { FOOD_DATA } from '../../utils/constants';

export const FoodFormTemplate = ({ name, foodType }) => {
  return function FoodForm() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [customFood, setCustomFood] = useState({ name: '', quantity: '' });
    const [waterIntake, setWaterIntake] = useState('');
    const [showCustom, setShowCustom] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await activityApi.fetch(user.id);
          if (res.success && res.data.food?.[foodType]) {
            const s = res.data.food[foodType];
            setSelectedFoods(s.selectedFoods || []);
            setWaterIntake(s.waterIntake || '');
          }
        } catch { console.error(`Fetch error`); } finally { setLoading(false); }
      };
      fetchData();
    }, [user.id, foodType]);

    const handleFoodSelect = (fn) => {
      if (fn === 'Manual Entry') return setShowCustom(true);
      const fd = FOOD_DATA[foodType][fn];
      setSelectedFoods(p => {
        const ex = p.find(f => f.name === fn);
        return ex ? p.map(it => it.name === fn ? { ...it, quantity: it.quantity + 1 } : it) : [...p, { name: fn, ...fd, quantity: 1 }];
      });
    };

    const addCustomFood = () => {
      if (!customFood.name) return toast.error('Enter name');
      const l = customFood.name.toLowerCase();
      const junk = ['burger', 'pizza', 'chips', 'sweet', 'coke', 'fries', 'soda', 'candy', 'cake'];
      const prot = ['chicken', 'egg', 'fish', 'meat', 'paneer', 'tofu', 'dal', 'soy'];
      const carb = ['rice', 'bread', 'roti', 'pasta', 'potato', 'corn'];

      let ana = { calories: 150, protein: 5, carbs: 20, fat: 5, category: 'healthy' };
      
      if (junk.some(k => l.includes(k))) {
        ana = { calories: 350, protein: 8, carbs: 45, fat: 18, category: 'junk' };
      } else if (prot.some(k => l.includes(k))) {
        ana = { calories: 250, protein: 25, carbs: 10, fat: 12, category: 'protein' };
      } else if (carb.some(k => l.includes(k))) {
        ana = { calories: 200, protein: 5, carbs: 45, fat: 2, category: 'carbs' };
      }

      setSelectedFoods(p => [...p, { name: customFood.name, ...ana, quantity: parseInt(customFood.quantity) || 1 }]);
      setCustomFood({ name: '', quantity: '' }); setShowCustom(false);
    };

    const totals = selectedFoods.reduce((t, f) => ({
      cal: t.cal + (f.calories * f.quantity),
      p: t.p + (f.protein * f.quantity),
      c: t.c + (f.carbs * f.quantity),
      f: t.f + (f.fat * f.quantity)
    }), { cal: 0, p: 0, c: 0, f: 0 });

    const handleSubmit = async () => {
      if (!selectedFoods.length && !waterIntake) return toast.error('Add items');
      try {
        await activityApi.save(user.id, name, { selectedFoods, waterIntake: parseFloat(waterIntake) || 0, totals: { calories: totals.cal, protein: totals.p, carbs: totals.c, fat: totals.f }, date: new Date().toISOString().split('T')[0] });
        toast.success('Saved'); navigate('/');
      } catch { toast.error("Save failed"); }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-center mb-8">{name} Log</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {Object.keys(FOOD_DATA[foodType]).map((f) => (
              <button key={f} onClick={() => handleFoodSelect(f)} className="p-3 border rounded-md hover:bg-gray-50 text-sm font-medium">{f}</button>
            ))}
          </div>
          {showCustom && (
            <div className="p-4 bg-blue-50 rounded-md mb-8">
              <input placeholder="Name" value={customFood.name} onChange={e => setCustomFood(p => ({ ...p, name: e.target.value }))} className="p-2 border rounded mr-2 text-sm" />
              <input placeholder="Qty" value={customFood.quantity} onChange={e => setCustomFood(p => ({ ...p, quantity: e.target.value }))} className="p-2 border rounded mr-2 text-sm" />
              <button onClick={addCustomFood} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold">Add</button>
            </div>
          )}
          <div className="space-y-3 mb-8">
            {selectedFoods.map((f, i) => (
              <div key={i} className="flex justify-between p-3 bg-gray-50 border rounded-md items-center">
                <span className="text-sm font-medium">{f.name} x{f.quantity} <span className="text-gray-400">({f.calories * f.quantity} cal)</span></span>
                <button onClick={() => setSelectedFoods(p => p.filter(it => it.name !== f.name))} className="text-red-500 text-xs font-bold uppercase tracking-wider">Remove</button>
              </div>
            ))}
          </div>
          {foodType === 'snack' && <input type="number" placeholder="Water (Liters)" value={waterIntake} onChange={e => setWaterIntake(e.target.value)} className="p-2 border rounded mb-8 w-full text-sm" />}
          <div className="grid grid-cols-4 text-center border-t border-dashed pt-4">
            <div><div className="font-bold text-lg">{totals.cal}</div><div className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Calories</div></div>
            <div><div className="font-bold text-lg">{totals.p}g</div><div className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Protein</div></div>
            <div><div className="font-bold text-lg">{totals.c}g</div><div className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Carbs</div></div>
            <div><div className="font-bold text-lg">{totals.f}g</div><div className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Fat</div></div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold shadow-sm shadow-blue-200">Save Daily Log</button>
            <button onClick={() => navigate('/')} className="flex-1 border-2 border-gray-100 py-3 rounded-lg font-bold text-gray-500">Cancel</button>
          </div>
        </div>
      </div>
    );
  };
};
