// Work.js
import './Work.css';

const jobs = [
  {
    id: 'job-1',
    role: 'Software Developer Intern',
    company: 'JuanTax',
    type: 'Internship',
    start: 'Sept. 2021',
    end: 'Nov. 2021',
    location: 'Remote',
    summary: 'JuanTax is a tax compliance platform that helps businesses and individuals file their taxes in the Philippines. I worked as a Software Developer Intern, where I was assigned to the upcoming dashboard project using ReactJS. My responsibilities include adding new features to the navigation and forms of the web pages.',
    bullets: [
      'Assigned to upcoming dashboard project using ReactJS',
      'Add new features to the navigation and forms to the web pages',
      'Apply encapsulation and modularity principles to the codebase',
    ],
    tech: ['ReactJS'],
  },
  {
    id: 'job-2',
    role: 'Software Developer',
    company: 'Qwikwire',
    type: 'Full-time',
    start: 'Aug. 2023',
    end: 'Dec. 2023',
    location: 'Hybrid, Makati City, Philippines',
    summary: 'Assisted on payment status updates.',
    bullets: [
      'Assisted on Portals and Dashboard status updates',
    ],
    tech: ['Python', 'Angular JS', 'PostgreSQL'],
  },
  {
    id: 'job-3',
    role: 'Software Developer',
    company: 'Qwikwire',
    type: 'Full-time',
    start: 'Mar. 2024',
    end: 'Oct. 2025',
    location: 'Hybrid, Makati City, Philippines',
    summary: 'Assisted on multiple projects and initiatives.',
    bullets: [
      'Refactored Aqwire Personal design to improve mobile user experience',
      'Integrated multiple payment gateways to the Portals platform',
      'Assisted on data cleanup and reduce redundancy on the database',
      'Collaborated with Compliance team to automate the process of reporting suspicious transactions to BSP and AMLA'
    ],
    tech: ['NextJS', 'TailwindCSS', 'PostgreSQL', 'Python', 'Angular JS', 'Redis', 'Docker', 'ssh', 'Git', 'Golang', 'Github Actions'],
  },
  {
    id: 'job-4',
    role: 'Software Developer',
    company: 'Rivvy',
    type: 'Full-time',
    start: 'Oct. 2025',
    end: 'Present',
    location: 'Remote',
    summary: 'Automating settlements and reports for Rivvy\'s internal operations.',
    bullets: [
      'Automated settlements and email reports for Rivvy\'s internal operations'
    ],
    tech: ['Python', 'Golang', 'PostgreSQL', 'Redis', 'ssh', 'Git'],
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