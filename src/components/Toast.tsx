import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { Icon } from './Icon'

type Tone = 'default' | 'success' | 'danger'
interface ToastItem { id: number; message: string; tone: Tone }
interface ToastApi { show: (message: string, tone?: Tone) => void }

const ToastContext = createContext<ToastApi>({ show: () => undefined })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const next = useRef(1)
  const dismiss = useCallback((id: number) => setItems((xs) => xs.filter((x) => x.id !== id)), [])
  const show = useCallback((message: string, tone: Tone = 'default') => {
    const id = next.current++
    setItems((xs) => [...xs.slice(-2), { id, message, tone }])
    window.setTimeout(() => dismiss(id), 4500)
  }, [dismiss])
  const api = useMemo(() => ({ show }), [show])
  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toasts" aria-live="polite" aria-atomic="false">
        {items.map((t) => (
          <div key={t.id} className={`toast${t.tone !== 'default' ? ` toast--${t.tone}` : ''}`} role={t.tone === 'danger' ? 'alert' : 'status'}>
            <Icon name={t.tone === 'success' ? 'check' : t.tone === 'danger' ? 'alert' : 'info'} />
            <span>{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification"><Icon name="x" size={18} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
