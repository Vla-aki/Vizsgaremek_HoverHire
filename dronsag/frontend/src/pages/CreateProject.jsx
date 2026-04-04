import React, { useState } from 'react';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'photography',
    location: '',
    budget_type: 'fix',
    budget: '',
    deadline: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Figyelem: Itt a user_id-t dinamikusan a bejelentkezett felhasználótól (pl. tokenből/contextből) kellene venni.
    // Jelenleg fixen a 3-as azonosítót küldjük (Ingatlan.com Zrt. az adatbázisodból) tesztelés céljából.
    const projectData = { ...formData, user_id: 3 };

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      
      if (response.ok) {
        alert('Munka sikeresen feladva!');
        // Ide jöhet egy átirányítás is, pl. navigate('/projects')
      } else {
        alert('Hiba történt a feladás során.');
      }
    } catch (error) {
      console.error("Hálózat hiba:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Új munka meghirdetése</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Munka megnevezése</label>
          <input type="text" name="title" required onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Pl. Építkezés heti drónos fotózása" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Részletes leírás</label>
          <textarea name="description" required rows="5" onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Írd le pontosan mire van szükséged..."></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategória</label>
            <select name="category" onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg">
              <option value="photography">Fotózás</option>
              <option value="videography">Videózás</option>
              <option value="inspection">Ipari ellenőrzés (Inspection)</option>
              <option value="mapping">Térképészet (Mapping)</option>
              <option value="delivery">Kiszállítás</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Helyszín</label>
            <input type="text" name="location" required onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg" placeholder="Pl. Budapest, 11. kerület" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Költségvetés típusa</label>
            <select name="budget_type" onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg">
              <option value="fix">Fix áras</option>
              <option value="hourly">Óradíjas</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Költségkeret (HUF)</label>
            <input type="number" name="budget" required onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg" placeholder="Pl. 50000" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Határidő</label>
          <input type="date" name="deadline" required onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg" />
        </div>
        <button type="submit" className="w-full mt-4 bg-blue-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-blue-700 transition">
          Munka meghirdetése
        </button>
      </form>
    </div>
  );
};

export default CreateProject;