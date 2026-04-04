import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext'; // Ha használsz saját AuthContext-et a bejelentkezés állapothoz

const Register = () => {
  const navigate = useNavigate();
  // const { login } = useAuth(); // Ha van AuthContext-ed, itt vedd ki a login függvényt

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
    autoLogin: true // Alapból be van pipálva az automatikus bejelentkezés
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        if (formData.autoLogin) {
          // HA BE VAN PIPÁLVA: Mentsük el az adatokat és léptessük be
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Ha használsz AuthContext-et, itt hívd meg a login függvényt:
          // login(data.user, data.token);

          // Átirányítás a szerepkörnek megfelelő oldalra
          if (data.user.role === 'driver') {
            navigate('/drone-dashboard');
          } else {
            navigate('/dashboard');
          }
        } else {
          // HA NINCS BEPIPÁLVA: Csak dobjuk át a login oldalra
          alert('Sikeres regisztráció! Kérlek, jelentkezz be.');
          navigate('/login');
        }
      } else {
        alert(data.message || 'Hiba történt a regisztráció során.');
      }
    } catch (error) {
      console.error("Hálózat hiba:", error);
      alert('Nem sikerült csatlakozni a szerverhez.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900">Regisztráció</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Teljes név</label>
            <input type="text" name="name" required onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-blue-500 focus:border-blue-500" placeholder="Kovács Péter" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email cím</label>
            <input type="email" name="email" required onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-blue-500 focus:border-blue-500" placeholder="peter@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefonszám (opcionális)</label>
            <input type="text" name="phone" onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-blue-500 focus:border-blue-500" placeholder="+36 30 123 4567" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Jelszó</label>
            <input type="password" name="password" required onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Milyen fiókot szeretnél?</label>
            <select name="role" onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="customer">Megbízó vagyok (munkát adnék fel)</option>
              <option value="driver">Drónpilóta vagyok (munkát keresek)</option>
            </select>
          </div>
          
          {/* ITT VAN A CHECKBOX AZ AUTO-LOGINHOZ */}
          <div className="flex items-center mt-2">
            <input type="checkbox" name="autoLogin" id="autoLogin" checked={formData.autoLogin} onChange={handleChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
            <label htmlFor="autoLogin" className="ml-2 text-sm text-gray-700 cursor-pointer">
              Automatikus bejelentkezés regisztráció után
            </label>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-blue-700 transition mt-6 shadow-md">
            Fiók létrehozása
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Már van fiókod? <Link to="/login" className="text-blue-600 hover:underline font-semibold">Jelentkezz be itt!</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;