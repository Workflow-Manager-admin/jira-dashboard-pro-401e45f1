import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project, onClick }) => {
  const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%23ccc" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E';

  const avatarUrl = project.avatar_urls?.['48x48'] || defaultAvatar;

  return (
    <div className="project-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="project-card-header">
        <img 
          src={avatarUrl} 
          alt={`${project.name} avatar`} 
          className="project-avatar"
          onError={(e) => {e.target.src = defaultAvatar}}
        />
        <div className="project-info">
          <h3 className="project-name">{project.name}</h3>
          <span className="project-key">{project.key}</span>
        </div>
      </div>
      
      <div className="project-type">
        {project.project_type_key.replace('_', ' ').toUpperCase()}
      </div>
      
      {project.description && (
        <p className="project-description">
          {project.description.length > 150 
            ? `${project.description.substring(0, 150)}...` 
            : project.description}
        </p>
      )}

      <div className="project-meta">
        {project.lead && (
          <div className="project-lead">
            Lead: {project.lead.displayName || project.lead.name || 'Unknown'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
