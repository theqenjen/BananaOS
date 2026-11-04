import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../os/icons';
import { useOS } from '../os/store';
import { getApp } from '../os/registry';

const BANNER = `BananaOS shell 1.0 (arm64)
Type "help" for a list of commands.`;

const BANANA_ART = [
  '        .-"""-.        ',
  '      .\'  .-.  `.      ',
  '     /   /   \\   \\     ',
  '    |   |     |   |    ',
  '     \\   \\   /   /     ',
  '      `.  `-\'  .\'      ',
  '        `-...-\'        ',
].join('\n');

export default function Terminal() {
  const { openApp, settings, conversations, photos } = useOS();
  const [lines, setLines] = useState([{ id: 'banner', type: 'out', text: BANNER }]);
  const [value, setValue] = useState('');
  const startRef = useRef(Date.now());
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [lines]);

  const print = (text) => setLines((list) => [...list, { id: Math.random().toString(36).slice(2), type: 'out', text }]);

  const run = (raw) => {
    const command = raw.trim();
    setLines((list) => [...list, { id: Math.random().toString(36).slice(2), type: 'cmd', text: command }]);
    if (!command) return;
    const [name, ...args] = command.split(/\s+/);
    const arg = args.join(' ');

    switch (name.toLowerCase()) {
      case 'help':
        print(
          [
            'Available commands:',
            '  help            this list',
            '  uname [-a]      kernel and machine information',
            '  neofetch        device summary',
            '  ls              home folders',
            '  open <app>      launch an app',
            '  date            current date and time',
            '  uptime          session uptime',
            '  whoami          current user',
            '  echo <text>     repeat text',
            '  apps            list installed apps',
            '  banana          🍌',
            '  clear           clear the screen',
          ].join('\n'),
        );
        break;
      case 'uname':
        print('BananaOS banana-one 1.0-plantain #1 SMP arm64 (web runtime)');
        break;
      case 'neofetch':
        print(
          [
            BANANA_ART,
            '',
            `user@banana-one`,
            '-----------------',
            `OS: BananaOS 1.0 "Plantain" arm64`,
            `Host: ${settings.deviceName}`,
            'Shell: bsh 1.0',
            `Uptime: ${Math.floor((Date.now() - startRef.current) / 1000)}s`,
            `Threads: ${conversations.length}   Photos: ${photos.length}`,
            `Wi-Fi: ${settings.wifi ? 'GroveNet' : 'off'}`,
          ].join('\n'),
        );
        break;
      case 'ls':
        print('Applications   Documents   Photos   Notes   Trash');
        break;
      case 'apps':
        print('phone  messages  browser  camera  photos  clock  calculator  notes  terminal  settings');
        break;
      case 'open': {
        const target = arg.toLowerCase();
        if (!target) {
          print('usage: open <app>');
          break;
        }
        if (getApp(target)) {
          print(`Launching ${target}…`);
          setTimeout(() => openApp(target), 250);
        } else {
          print(`bsh: app not found: ${target}`);
        }
        break;
      }
      case 'date':
        print(new Date().toString());
        break;
      case 'uptime':
        print(`up ${Math.floor((Date.now() - startRef.current) / 1000)} seconds, 1 user, load average: 0.04 0.02 0.01`);
        break;
      case 'whoami':
        print('banana');
        break;
      case 'echo':
        print(arg);
        break;
      case 'banana':
        print('🍌');
        break;
      case 'clear':
        setLines([]);
        break;
      default:
        print(`bsh: command not found: ${name}`);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    run(value);
    setValue('');
  };

  return (
    <div className="app-frame terminal-app">
      <div className="terminal-bar">
        <span className="terminal-dots">
          <i /> <i /> <i />
        </span>
        <span className="terminal-title">banana@one — bsh</span>
        <button type="button" className="icon-button" onClick={() => setLines([])} aria-label="Clear screen">
          <Icon name="trash" size={17} />
        </button>
      </div>

      <div className="terminal-body" onClick={() => inputRef.current?.focus()}>
        {lines.map((line) =>
          line.type === 'cmd' ? (
            <div key={line.id} className="term-line cmd">
              <span className="term-prompt">banana@one:~$</span> {line.text}
            </div>
          ) : (
            <pre key={line.id} className="term-line out">
              {line.text}
            </pre>
          ),
        )}
        <form className="term-input-row" onSubmit={submit}>
          <span className="term-prompt">banana@one:~$</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-label="Terminal input"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            autoFocus
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
