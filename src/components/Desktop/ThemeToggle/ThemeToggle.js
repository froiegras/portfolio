import useTheme from '../../../hooks/useTheme';
import './ThemeToggle.css';
import Icon from '../../Shared/Icons/Icons';

const ICONS = { auto: 'night-day', light: 'sun', dark: 'moon' };
const NAMES = { auto: 'Auto (by time of day)', light: 'Light', dark: 'Dark' };

export default function ThemeToggle() {
  const { pref, theme, cycle } = useTheme();
  const label = `Theme: ${NAMES[pref]}${pref === 'auto' ? `, currently ${theme}` : ''}. Click to change.`;

  return (
    <button className="theme-toggle" onClick={cycle} aria-label={label} title={label}>
      <Icon name={ICONS[pref]} />
    </button>
  );
}