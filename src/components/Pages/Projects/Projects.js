// Projects.js
import './Projects.css';
import GithubRepos from './GithubRepos';

const projects = [
  {
    id: 'api-integration',
    icon: '🔌',
    name: 'Third Party API Integration',
    kind: 'Work Project',
    summary: 'Integrated an external payment gateway API into company gateway.',
    highlights: [
      'Handled webhooks and API requests',
      'Spearheaded the integration of a third-party API into an existing application',
      'Communicated with the API provider to resolve issues and ensure smooth integration',
    ],
    tech: ['Angular', 'Python', 'PostgreSQL',],
    links: [],
  },
  {
    id: 'thesis',
    icon: '📄',
    name: 'Thesis',
    kind: 'Academic Project',
    summary: 'Effectiveness of Using Fundus Image Data Containing Other Retinal Diseases in Identifying Age-Related Macular Degeneration using Image Classification ',
    highlights: [
      'Assisted on development of a machine learning algorithm',
      'Data preprocessing and augmentation for training the model',
      'Researched multiple image preprocessing and image segmentation techniques to improve model performance',
    ],
    tech: ['Python', 'Conda', 'TensorFlow', 'Keras', 'OpenCV', 'NumPy', 'Pandas'],
    links: [],
  },
];

function Projects() {
  return (
    <>
      <div className="projects-grid">
        {projects.map(({ id, icon, name, kind, summary, highlights, tech, links }) => {
          const shownLinks = links.filter((l) => l.href);
          return (
            <article key={id} className="project-card">
              <header className="project-head">
                <span className="project-icon" aria-hidden="true">{icon}</span>
                <div>
                  <h2 className="project-text">{name}</h2>
                  <span className="project-kind">{kind}</span>
                </div>
              </header>

              <p className="project-summary">{summary}</p>

              {highlights.length > 0 && (
                <ul className="project-highlights">
                  {highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
              )}

              <ul className="project-tags">
                {tech.map((t) => <li key={t}>{t}</li>)}
              </ul>

              {shownLinks.length > 0 && (
                <div className="project-links">
                  {shownLinks.map(({ label, href }) => (
                    <a key={label} href={href} target="_blank" rel="noreferrer">
                      {label} ↗
                    </a>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
      <GithubRepos />
    </>
  );
}

export default Projects;