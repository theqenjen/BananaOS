import StatusBar from './StatusBar.jsx';
import HomeBar from './HomeBar.jsx';

export default function AppWindow({ app, active, onHome, onRecents, onOpenControlCenter }) {
  const App = app.component;
  return (
    <section className={`app-window ${active ? 'is-active' : ''}`} data-app={app.id} aria-hidden={!active}>
      <StatusBar tint="app" onOpenControlCenter={onOpenControlCenter} />
      <div className="app-body">
        <App onHome={onHome} />
      </div>
      <HomeBar onHome={onHome} onRecents={onRecents} />
    </section>
  );
}
