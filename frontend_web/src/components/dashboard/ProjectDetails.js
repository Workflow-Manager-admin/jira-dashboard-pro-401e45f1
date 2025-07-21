import React, { useState, useEffect } from 'react';
import { projects } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import './ProjectDetails.css';

const ProjectDetails = ({ project, onClose }) => {
  const [details, setDetails] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [detailsData, statsData] = await Promise.all([
          projects.getDetails(project.key),
          projects.getStatistics(project.key)
        ]);
        
        setDetails(detailsData);
        setStatistics(statsData);
      } catch (err) {
        setError('Failed to load project details');
        console.error('Error fetching project details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [project.key]);

  const handleExport = async () => {
    try {
      const blob = await projects.exportData(project.key);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.key}-data.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting project data:', err);
    }
  };

  return (
    <div className="project-details-overlay" onClick={onClose}>
      <div className="project-details" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close details">
          ×
        </button>

        <div className="project-details-header">
          <h2>{project.name}</h2>
          <span className="project-key">{project.key}</span>
        </div>

        {loading ? (
          <div className="details-loading">
            <LoadingSpinner size="medium" />
          </div>
        ) : error ? (
          <div className="details-error">{error}</div>
        ) : (
          <>
            <div className="details-section">
              <h3>Overview</h3>
              <p>{details?.description || 'No description available'}</p>
              
              {details?.lead && (
                <div className="detail-item">
                  <strong>Project Lead:</strong> {details.lead.displayName || details.lead.name}
                </div>
              )}
              
              <div className="detail-item">
                <strong>Project Type:</strong> {project.project_type_key.replace('_', ' ').toUpperCase()}
              </div>
            </div>

            {statistics && (
              <div className="details-section">
                <h3>Statistics</h3>
                <div className="statistics-grid">
                  <div className="stat-item">
                    <span className="stat-label">Total Issues</span>
                    <span className="stat-value">{statistics.total_issues}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Open</span>
                    <span className="stat-value">{statistics.open_issues}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">In Progress</span>
                    <span className="stat-value">{statistics.in_progress_issues}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Resolved</span>
                    <span className="stat-value">{statistics.resolved_issues}</span>
                  </div>
                </div>

                <div className="details-charts">
                  <div className="chart-section">
                    <h4>Issues by Priority</h4>
                    <div className="chart-bars">
                      {Object.entries(statistics.by_priority).map(([priority, count]) => (
                        <div key={priority} className="chart-bar">
                          <div className="bar-label">{priority}</div>
                          <div 
                            className="bar-value" 
                            style={{ 
                              width: `${(count / statistics.total_issues) * 100}%` 
                            }}
                          >
                            {count}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="details-actions">
              <button onClick={handleExport} className="export-button">
                Export to CSV
              </button>
              {project.url && (
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="view-button"
                >
                  View in Jira
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
