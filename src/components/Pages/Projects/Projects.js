// Projects.js
import './Projects.css';

const projects = [
  {
    id: 'soundboard-bot',
    icon: '🔊',
    name: 'Soundboard Discord Bot',
    kind: 'Personal Project',
    summary: 'A Discord bot that plays sound clips in voice channels on command.', // placeholder
    highlights: [
      'Slash commands to play, queue and list sounds',
      'Auto reply for specific messages',
    ], // placeholders
    tech: ['Python', 'PostgreSQL'], // placeholders
    links: [
      { label: 'GitHub', href: '' }, // empty href = link is hidden
    ],
  },
  {
    id: 'api-integration',
    icon: '🔌',
    name: 'Third Party API Integration',
    kind: 'Work Project',
    summary: 'Integrated an external API into an existing application.',
    highlights: [
      'Handled webhooks and API requests',
      'Spearheaded the integration of a third-party API into an existing application',
    ], // placeholders
    tech: ['ReactJS', 'Redis'], // placeholders
    links: [],
  },
];

function Projects() {
  return (
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
  );
}

export default Projects;