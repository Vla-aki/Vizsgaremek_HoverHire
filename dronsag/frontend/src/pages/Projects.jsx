import React, { useState, useEffect } from 'react';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Cseréld le a portot a saját backend portodra (pl. 5000 vagy 3000)
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Hiba történt a munkák betöltésekor:", err));
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Elérhető Munkák</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <p className="text-gray-500">Jelenleg nincs elérhető munka.</p>
        ) : (
          projects.map(project => (
            <div key={project.id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-blue-600 truncate">{project.title}</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {project.category}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{project.location}</p>
              <p className="mb-4 text-gray-700 line-clamp-3 h-16">{project.description}</p>
              <div className="flex flex-col text-sm font-medium border-t pt-4 mt-2">
                <span className="mb-1">{project.budget_type === 'fix' ? 'Fix áras' : 'Óradíjas'}: <span className="text-green-600">{project.budget} Ft</span></span>
                <span className="text-gray-500">Határidő: {new Date(project.deadline).toLocaleDateString('hu-HU')}</span>
              </div>
              <p className="text-xs text-gray-400 mt-4">Megrendelő: {project.customer_name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;