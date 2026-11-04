import { useOS } from './os/OSProvider'
import { BootScreen } from './components/BootScreen'
import { LockScreen } from './components/LockScreen'
import { Desktop } from './components/Desktop'

export default function App() {
  const { data, ui, actions } = useOS()
  const brightness = data.settings.brightness

  return (
    <div className="stage">
      <div className={`device wallpaper-${data.settings.wallpaper}`}>
        {ui.phase === 'boot' && <BootScreen onSkip={actions.skipBoot} />}
        {ui.phase === 'lock' && <LockScreen />}
        {ui.phase === 'home' && <Desktop />}
        <div className="screen-dim" style={{ opacity: (1 - brightness) * 0.55 }} aria-hidden="true" />
      </div>
    </div>
  )
}
