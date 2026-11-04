import {
  Phone,
  MessageSquare,
  Compass,
  Images,
  CloudSun,
  Clock3,
  NotebookPen,
  CalendarDays,
  Calculator,
  Settings as SettingsIcon,
  Music2,
} from 'lucide-react';
import PhoneApp from '../apps/Phone.jsx';
import MessagesApp from '../apps/Messages.jsx';
import BrowserApp from '../apps/Browser.jsx';
import PhotosApp from '../apps/Photos.jsx';
import WeatherApp from '../apps/Weather.jsx';
import ClockApp from '../apps/Clock.jsx';
import NotesApp from '../apps/Notes.jsx';
import CalendarApp from '../apps/Calendar.jsx';
import CalculatorApp from '../apps/Calculator.jsx';
import SettingsApp from '../apps/Settings.jsx';
import MusicApp from '../apps/Music.jsx';

export const APPS = [
  {
    id: 'phone',
    name: 'Phone',
    icon: Phone,
    tint: 'linear-gradient(160deg,#5BE38B,#16A34A)',
    component: PhoneApp,
    dock: true,
  },
  {
    id: 'messages',
    name: 'Messages',
    icon: MessageSquare,
    tint: 'linear-gradient(160deg,#6EE7A8,#0F9D58)',
    component: MessagesApp,
    dock: true,
  },
  {
    id: 'browser',
    name: 'Browser',
    icon: Compass,
    tint: 'linear-gradient(160deg,#7FB4FF,#2563EB)',
    component: BrowserApp,
    dock: true,
  },
  {
    id: 'photos',
    name: 'Photos',
    icon: Images,
    tint: 'linear-gradient(160deg,#FFD34E,#F97316 55%,#EC4899)',
    component: PhotosApp,
    dock: true,
  },
  {
    id: 'weather',
    name: 'Weather',
    icon: CloudSun,
    tint: 'linear-gradient(160deg,#67E8F9,#2563EB)',
    component: WeatherApp,
  },
  {
    id: 'clock',
    name: 'Clock',
    icon: Clock3,
    tint: 'linear-gradient(160deg,#3A3A44,#0B0B0F)',
    component: ClockApp,
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: NotebookPen,
    tint: 'linear-gradient(160deg,#FFE28A,#E0A800)',
    component: NotesApp,
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: CalendarDays,
    tint: 'linear-gradient(160deg,#FF8A80,#D32F2F)',
    component: CalendarApp,
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: Calculator,
    tint: 'linear-gradient(160deg,#5B5B66,#1C1C22)',
    component: CalculatorApp,
  },
  {
    id: 'music',
    name: 'Music',
    icon: Music2,
    tint: 'linear-gradient(160deg,#FF9BD2,#DB2777)',
    component: MusicApp,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: SettingsIcon,
    tint: 'linear-gradient(160deg,#A8B0BD,#4B5563)',
    component: SettingsApp,
  },
];

export const APP_BY_ID = Object.fromEntries(APPS.map((app) => [app.id, app]));
