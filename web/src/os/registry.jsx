import Browser from '../apps/Browser';
import Phone from '../apps/Phone';
import Messages from '../apps/Messages';
import Camera from '../apps/Camera';
import Photos from '../apps/Photos';
import Clock from '../apps/Clock';
import Calculator from '../apps/Calculator';
import Notes from '../apps/Notes';
import Terminal from '../apps/Terminal';
import Settings from '../apps/Settings';

export const APPS = [
  { id: 'phone', name: 'Phone', glyph: 'phone', bg: 'linear-gradient(160deg,#5BE37D,#12A150)', component: Phone },
  { id: 'messages', name: 'Messages', glyph: 'messages', bg: 'linear-gradient(160deg,#7BEB8F,#1FA84A)', component: Messages },
  { id: 'browser', name: 'Browser', glyph: 'globe', bg: 'linear-gradient(160deg,#6FC8FF,#1B6BE0)', component: Browser },
  { id: 'camera', name: 'Camera', glyph: 'camera', bg: 'linear-gradient(160deg,#4A4A52,#16161A)', component: Camera },
  { id: 'photos', name: 'Photos', glyph: 'photos', bg: 'linear-gradient(160deg,#FFD76E,#FF7A45)', component: Photos, ink: '#3A1B00' },
  { id: 'clock', name: 'Clock', glyph: 'clock', bg: 'linear-gradient(160deg,#3C3C45,#101014)', component: Clock },
  { id: 'calculator', name: 'Calculator', glyph: 'calculator', bg: 'linear-gradient(160deg,#FFB84D,#E8621B)', component: Calculator, ink: '#2A1200' },
  { id: 'notes', name: 'Notes', glyph: 'notes', bg: 'linear-gradient(160deg,#FFE28A,#F2B01E)', component: Notes, ink: '#3A2A00' },
  { id: 'terminal', name: 'Terminal', glyph: 'terminal', bg: 'linear-gradient(160deg,#2B2B33,#0B0B0E)', component: Terminal, ink: '#8CF17A' },
  { id: 'settings', name: 'Settings', glyph: 'settings', bg: 'linear-gradient(160deg,#8E8E99,#43434C)', component: Settings },
];

export const DOCK_IDS = ['phone', 'messages', 'browser', 'camera', 'photos'];

export const getApp = (id) => APPS.find((item) => item.id === id);
