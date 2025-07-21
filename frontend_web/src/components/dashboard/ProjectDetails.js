import React, { useState, useEffect, useCallback } from 'react';
import { projects } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import './ProjectDetails.css';

// PUBLIC_INTERFACE
const ProjectDetails = ({ project, onClose }) => {
  const [details, setDetails] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    statistics: true,
    priority: false,
    type: false,
    components: false,
    versions: false
  });

  const fetchDetails = useCallback(async () => {
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
  }, [project.key]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const calculatePercentage = (value, total) => {
    return total > 0 ? (value / total * 100).toFixed(1) : 0;
  };

  const SectionHeader = ({ title, expanded, onToggle, children }) => (
    <div className="section-header" onClick={onToggle}>
      <button 
        className="section-toggle"
        aria-expanded={expanded}
        aria-controls={`section-${title.toLowerCase()}`}
      >
        <span className="section-title">{title}</span>
        <span className="section-icon">{expanded ? '−' : '+'}</span>
      </button>
      {children}
    </div>
  );

  return (
    <div 
      className="project-details-overlay" 
      onClick={onClose}
      role="dialog"
      aria-label={`Details for project ${project.name}`}
    >
      <div 
        className="project-details" 
        onClick={e => e.stopPropagation()}
        role="document"
      >
        <button 
          className="close-button" 
          onClick={onClose} 
          aria-label="Close details"
        >
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
          <div className="details-error" role="alert">{error}</div>
        ) : (
          <>
            <div className="details-section">
              <SectionHeader 
                title="Overview"
                expanded={expandedSections.overview}
                onToggle={() => toggleSection('overview')}
              />
              {expandedSections.overview && (
                <div id="section-overview" className="section-content">
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
              )}
            </div>

            {statistics && (
              <>
                <div className="details-section">
                  <SectionHeader 
                    title="Issue Statistics"
                    expanded={expandedSections.statistics}
                    onToggle={() => toggleSection('statistics')}
                  />
                  {expandedSections.statistics && (
                    <div id="section-statistics" className="section-content">
                      <div className="statistics-grid">
                        <div className="stat-item" role="status">
                          <span className="stat-label">Total Issues</span>
                          <span className="stat-value">{statistics.total_issues}</span>
                        </div>
                        <div className="stat-item" role="status">
                          <span className="stat-label">Open</span>
                          <span className="stat-value">
                            {statistics.open_issues}
                            <span className="stat-percentage">
                              ({calculatePercentage(statistics.open_issues, statistics.total_issues)}%)
                            </span>
                          </span>
                        </div>
                        <div className="stat-item" role="status">
                          <span className="stat-label">In Progress</span>
                          <span className="stat-value">
                            {statistics.in_progress_issues}
                            <span className="stat-percentage">
                              ({calculatePercentage(statistics.in_progress_issues, statistics.total_issues)}%)
                            </span>
                          </span>
                        </div>
                        <div className="stat-item" role="status">
                          <span className="stat-label">Resolved</span>
                          <span className="stat-value">
                            {statistics.resolved_issues}
                            <span className="stat-percentage">
                              ({calculatePercentage(statistics.resolved_issues, statistics.total_issues)}%)
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="details-section">
                  <SectionHeader 
                    title="Priority Distribution"
                    expanded={expandedSections.priority}
                    onToggle={() => toggleSection('priority')}
                  />
                  {expandedSections.priority && (
                    <div id="section-priority" className="section-content">
                      <div className="chart-bars" role="group" aria-label="Issue priority distribution">
                        {Object.entries(statistics.by_priority).map(([priority, count]) => (
                          <div key={priority} className="chart-bar">
                            <div className="bar-label">{priority}</div>
                            <div 
                              className="bar-value" 
                              style={{ width: `${(count / statistics.total_issues) * 100}%` }}
                              role="progressbar"
                              aria-valuenow={count}
                              aria-valuemin="0"
                              aria-valuemax={statistics.total_issues}
                              aria-label={`${priority}: ${count} issues`}
                            >
                              {count} ({calculatePercentage(count, statistics.total_issues)}%)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="details-section">
                  <SectionHeader 
                    title="Issue Types"
                    expanded={expandedSections.type}
                    onToggle={() => toggleSection('type')}
                  />
                  {expandedSections.type && (
                    <div id="section-type" className="section-content">
                      <div className="chart-bars" role="group" aria-label="Issue type distribution">
                        {Object.entries(statistics.by_type).map(([type, count]) => (
                          <div key={type} className="chart-bar">
                            <div className="bar-label">{type}</div>
                            <div 
                              className="bar-value" 
                              style={{ width: `${(count / statistics.total_issues) * 100}%` }}
                              role="progressbar"
                              aria-valuenow={count}
                              aria-valuemin="0"
                              aria-valuemax={statistics.total_issues}
                              aria-label={`${type}: ${count} issues`}
                            >
                              {count} ({calculatePercentage(count, statistics.total_issues)}%)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {details?.components && details.components.length > 0 && (
              <div className="details-section">
                <SectionHeader 
                  title="Components"
                  expanded={expandedSections.components}
                  onToggle={() => toggleSection('components')}
                />
                {expandedSections.components && (
                  <div id="section-components" className="section-content">
                    <div className="components-list">
                      {details.components.map(component => (
                        <div key={component.id} className="component-item">
                          <h4>{component.name}</h4>
                          {component.description && <p>{component.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {details?.versions && details.versions.length > 0 && (
              <div className="details-section">
                <SectionHeader 
                  title="Versions"
                  expanded={expandedSections.versions}
                  onToggle={() => toggleSection('versions')}
                />
                {expandedSections.versions && (
                  <div id="section-versions" className="section-content">
                    <div className="versions-list">
                      {details.versions.map(version => (
                        <div key={version.id} className="version-item">
                          <h4>{version.name}</h4>
                          {version.description && <p>{version.description}</p>}
                          <div className="version-meta">
                            {version.releaseDate && (
                              <span>Release: {new Date(version.releaseDate).toLocaleDateString()}</span>
                            )}
                            <span className={`version-status ${version.released ? 'released' : 'unreleased'}`}>
                              {version.released ? 'Released' : 'Unreleased'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="details-actions">
              <button 
                onClick={handleExport} 
                className="export-button"
                aria-label="Export project data to CSV"
              >
                Export to CSV
              </button>
              {project.url && (
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="view-button"
                  aria-label="View project in Jira"
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
