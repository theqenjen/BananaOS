import { useState } from 'react'
import { AppShell } from '../components/AppShell'

const OPS = { add: '+', sub: '−', mul: '×', div: '÷' }

function compute(a, b, op) {
  switch (op) {
    case 'add':
      return a + b
    case 'sub':
      return a - b
    case 'mul':
      return a * b
    case 'div':
      return b === 0 ? null : a / b
    default:
      return b
  }
}

function format(value) {
  if (value === null) return 'Error'
  const rounded = Math.round(value * 1e10) / 1e10
  if (Math.abs(rounded) >= 1e12) return rounded.toExponential(5)
  return String(rounded)
}

export function CalculatorApp() {
  const [display, setDisplay] = useState('0')
  const [previous, setPrevious] = useState(null)
  const [operator, setOperator] = useState(null)
  const [overwrite, setOverwrite] = useState(true)

  const pressDigit = (digit) => {
    if (display === 'Error') {
      setDisplay(digit)
      setOverwrite(true)
      return
    }
    if (overwrite) {
      setDisplay(digit)
      setOverwrite(false)
      return
    }
    if (display.replace('-', '').replace('.', '').length >= 11) return
    setDisplay(display === '0' ? digit : display + digit)
  }

  const pressDecimal = () => {
    if (overwrite) {
      setDisplay('0.')
      setOverwrite(false)
      return
    }
    if (!display.includes('.')) setDisplay(`${display}.`)
  }

  const pressOperator = (next) => {
    const value = Number(display)
    if (previous !== null && operator && !overwrite) {
      const result = compute(previous, value, operator)
      setPrevious(result)
      setDisplay(format(result))
    } else {
      setPrevious(value)
    }
    setOperator(next)
    setOverwrite(true)
  }

  const pressEquals = () => {
    if (previous === null || !operator) return
    const result = compute(previous, Number(display), operator)
    setDisplay(format(result))
    setPrevious(null)
    setOperator(null)
    setOverwrite(true)
  }

  const clear = () => {
    setDisplay('0')
    setPrevious(null)
    setOperator(null)
    setOverwrite(true)
  }

  const toggleSign = () => {
    setDisplay((value) => (value.startsWith('-') ? value.slice(1) : value === '0' ? value : `-${value}`))
  }

  const percent = () => {
    setDisplay((value) => format(Number(value) / 100))
    setOverwrite(true)
  }

  const showClear = display !== '0' || previous !== null

  return (
    <AppShell className="calculator-app" title="Calculator" headless>
      <div className="calc">
        <div className="calc-display" aria-live="polite">
          {operator && <span className="calc-op">{OPS[operator]}</span>}
          {display}
        </div>
        <div className="calc-grid">
          <button type="button" className="calc-key fn" onClick={clear}>
            {showClear ? 'C' : 'AC'}
          </button>
          <button type="button" className="calc-key fn" onClick={toggleSign}>
            +/−
          </button>
          <button type="button" className="calc-key fn" onClick={percent}>
            %
          </button>
          <button type="button" className="calc-key op" onClick={() => pressOperator('div')}>
            ÷
          </button>

          {['7', '8', '9'].map((digit) => (
            <button type="button" key={digit} className="calc-key" onClick={() => pressDigit(digit)}>
              {digit}
            </button>
          ))}
          <button type="button" className="calc-key op" onClick={() => pressOperator('mul')}>
            ×
          </button>

          {['4', '5', '6'].map((digit) => (
            <button type="button" key={digit} className="calc-key" onClick={() => pressDigit(digit)}>
              {digit}
            </button>
          ))}
          <button type="button" className="calc-key op" onClick={() => pressOperator('sub')}>
            −
          </button>

          {['1', '2', '3'].map((digit) => (
            <button type="button" key={digit} className="calc-key" onClick={() => pressDigit(digit)}>
              {digit}
            </button>
          ))}
          <button type="button" className="calc-key op" onClick={() => pressOperator('add')}>
            +
          </button>

          <button type="button" className="calc-key zero" onClick={() => pressDigit('0')}>
            0
          </button>
          <button type="button" className="calc-key" onClick={pressDecimal}>
            .
          </button>
          <button type="button" className="calc-key op equals" onClick={pressEquals}>
            =
          </button>
        </div>
      </div>
    </AppShell>
  )
}
