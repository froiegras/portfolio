import { pages } from '../../pages';
import MobileHome from './MobileHome';
import MobileDock from './MobileDock';
import AppScreen from './AppScreen';
import './Mobile.css';

export default function MobileShell({ current, onOpen, onHome }) {
  const page = pages[current];

  return (
    <div className="m-shell">
      <main>
        {page ? (
          <AppScreen key={current} title={page.title} onBack={onHome}>
            <page.Component onNavigate={onOpen} />
          </AppScreen>
        ) : (
          <MobileHome onOpen={onOpen} />
        )}
      </main>
      <MobileDock current={current} onOpen={onOpen} onHome={onHome} />
    </div>
  );
}