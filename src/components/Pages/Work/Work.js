// Work.js
import './work.css';

const jobs = [
  {
    id: 'job-1',
    role: 'Software Developer',            // placeholder
    company: 'Company Name',               // placeholder
    type: 'Full-time',
    start: 'Jun 2024',
    end: 'Present',
    location: 'Manila, PH',
    summary: 'One line on what your team does and your part in it.',
    bullets: [
      'Integrated a third-party API, handling auth, rate limits and caching',
      'Built and maintained features in a ReactJS + PostgreSQL codebase',
    ],
    tech: ['ReactJS', 'PostgreSQL', 'Redis'],
  },
  {
    id: 'job-2',
    role: 'Intern',
    company: 'Another Company',
    type: 'Internship',
    start: 'Jan 2024',
    end: 'May 2024',
    location: 'Remote',
    summary: 'What you worked on.',
    bullets: ['Something you shipped or improved'],
    tech: ['Python'],
  },
];

function Work() {
  return (
    <ol className="work-timeline">
      {jobs.map(({ id, role, company, type, start, end, location, summary, bullets, tech }) => (
        <li key={id} className={`work-item${end === 'Present' ? ' current' : ''}`}>
          <header className="work-head">
            <h2 className="work-role">{role}</h2>
            <span className="work-company">@ {company}</span>
          </header>

          <p className="work-meta">
            {start} – {end} · {type} · {location}
          </p>

          <p className="work-summary">{summary}</p>

          {bullets.length > 0 && (
            <ul className="work-bullets">
              {bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
          )}

          <ul className="work-tags">
            {tech.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export default Work;