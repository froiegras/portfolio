import React from 'react';
import useIsDesktop from '../../hooks/useIsDesktop';
import './Resume.css';

const RESUME_URL = '/media/resume/Divina_Froilan_Resume.pdf';
const DOWNLOAD_NAME = 'Divina_Froilan_Resume.pdf';

export default function ResumeFile() {
  const isDesktop = useIsDesktop();

  return (
    <div className="resume">
      <div className="resume-bar">
        <span className="resume-name">{DOWNLOAD_NAME}</span>
        <div className="resume-actions">
          <a className="resume-btn primary" href={RESUME_URL} download={DOWNLOAD_NAME}>
            Download PDF
          </a>
          <a className="resume-btn" href={RESUME_URL} target="_blank" rel="noreferrer">
            Open in new tab
          </a>
        </div>
      </div>

      {isDesktop ? (
        <iframe
          className="resume-frame"
          src={`${RESUME_URL}#toolbar=0&navpanes=0&view=FitH`}
          title="Resume (PDF)"
        />
      ) : (
        <p className="resume-note">
          PDF previews don't work well on phones, so use the buttons above to open or download it.
        </p>
      )}
    </div>
  );
}