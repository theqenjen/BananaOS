import { useOS } from '../os/OSProvider'
import { MessagesApp } from '../apps/MessagesApp'
import { PhoneApp } from '../apps/PhoneApp'
import { BrowserApp } from '../apps/BrowserApp'
import { PhotosApp } from '../apps/PhotosApp'
import { ClockApp } from '../apps/ClockApp'
import { CalculatorApp } from '../apps/CalculatorApp'
import { CalendarApp } from '../apps/CalendarApp'
import { WeatherApp } from '../apps/WeatherApp'
import { NotesApp } from '../apps/NotesApp'
import { SettingsApp } from '../apps/SettingsApp'

const COMPONENTS = {
  messages: MessagesApp,
  phone: PhoneApp,
  browser: BrowserApp,
  photos: PhotosApp,
  clock: ClockApp,
  calculator: CalculatorApp,
  calendar: CalendarApp,
  weather: WeatherApp,
  notes: NotesApp,
  settings: SettingsApp,
}

export function AppHost() {
  const { ui } = useOS()
  if (!ui.activeApp) return null
  const Component = COMPONENTS[ui.activeApp]
  if (!Component) return null
  return (
    <div className="app-host" key={ui.activeApp}>
      <Component />
    </div>
  )
}
