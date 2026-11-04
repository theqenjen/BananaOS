import { useOS } from '../os/OSProvider'
import { StatusBar, Island } from './StatusBar'
import { HomeScreen, Dock } from './HomeScreen'
import { AppHost } from './AppHost'
import { AppSwitcher } from './AppSwitcher'
import { ControlCenter } from './ControlCenter'
import { BannerStack } from './BannerStack'
import { HomeIndicator } from './HomeIndicator'

export function Desktop() {
  const { ui } = useOS()
  return (
    <div className={`desktop ${ui.activeApp ? 'has-app' : ''}`}>
      <div className="wallpaper" aria-hidden="true">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
      </div>

      <div className="home-stack">
        <HomeScreen />
        <Dock />
      </div>

      <AppHost />
      <AppSwitcher />
      <ControlCenter />

      <StatusBar interactive />
      <Island />
      <BannerStack />
      <HomeIndicator />
    </div>
  )
}
