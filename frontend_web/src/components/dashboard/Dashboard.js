import React, { useState, useEffect } from 'react';
import { projects } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ProjectCard from './ProjectCard';
import ProjectDetails from './ProjectDetails';
import './Dashboard.css';

const Dashboard = () => {
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [projectTypeFilter, setProjectTypeFilter] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectTypes, setProjectTypes] = useState(new Set());

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projects.getAll();
      setProjectList(data);
      // Extract unique project types
      const types = new Set(data.map(project => project.project_type_key));
      setProjectTypes(types);
    } catch (err) {
      setError('Failed to fetch projects. Please try again later.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseDetails = () => {
    setSelectedProject(null);
  };

  const filteredProjects = projectList.filter(project => {
    const matchesSearch = searchTerm === '' || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.key.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = projectTypeFilter === '' || 
      project.project_type_key === projectTypeFilter;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div className="dashboard-loading"><LoadingSpinner size="large" /></div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Projects Dashboard</h1>
        <div className="dashboard-filters">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search projects"
          />
          <select
            value={projectTypeFilter}
            onChange={(e) => setProjectTypeFilter(e.target.value)}
            className="type-filter"
            aria-label="Filter by project type"
          >
            <option value="">All Types</option>
            {Array.from(projectTypes).map(type => (
              <option key={type} value={type}>
                {type.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.length === 0 ? (
          <div className="no-projects">
            No projects found matching your criteria
          </div>
        ) : (
          filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))
        )}
      </div>

      {selectedProject && (
        <ProjectDetails
          project={selectedProject}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default Dashboard;
