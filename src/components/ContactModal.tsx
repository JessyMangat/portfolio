import { useEffect, useState, type FormEvent } from 'react'

interface ContactModalProps {
  onClose: () => void
}

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')
}

export function ContactModal({ onClose }: ContactModalProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const data: Record<string, string> = { 'form-name': 'contact' }
    formData.forEach((value, key) => {
      data[key] = String(value)
    })

    setStatus('submitting')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(data),
      })
      if (!res.ok) throw new Error('Form submission failed')
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-50 flex cursor-default items-center justify-center bg-bg/80 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-fg/10 bg-bg p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-fg">Get in touch</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer font-mono text-fg/50 transition-colors hover:text-fg"
          >
            ✕
          </button>
        </div>

        {status === 'success' ? (
          <p className="font-mono text-sm text-fg/70">Thanks — I&rsquo;ll get back to you soon.</p>
        ) : (
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 font-mono text-sm"
          >
            <input type="hidden" name="form-name" value="contact" />
            <label className="hidden">
              Don&rsquo;t fill this out: <input name="bot-field" />
            </label>

            <input
              required
              name="name"
              placeholder="Name"
              autoComplete="name"
              className="cursor-text rounded-lg border border-fg/15 bg-transparent px-3 py-2 text-fg placeholder:text-fg/40 focus:border-accent focus:outline-none"
            />
            <input
              required
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              className="cursor-text rounded-lg border border-fg/15 bg-transparent px-3 py-2 text-fg placeholder:text-fg/40 focus:border-accent focus:outline-none"
            />
            <textarea
              required
              name="message"
              placeholder="Message"
              rows={4}
              className="cursor-text resize-none rounded-lg border border-fg/15 bg-transparent px-3 py-2 text-fg placeholder:text-fg/40 focus:border-accent focus:outline-none"
            />

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-1 cursor-pointer rounded-lg bg-accent px-4 py-2 font-semibold text-bg transition-opacity disabled:cursor-default disabled:opacity-60"
            >
              {status === 'submitting' ? 'Sending…' : 'Send'}
            </button>
            {status === 'error' && <p className="text-red-400">Something went wrong. Please try again.</p>}
          </form>
        )}
      </div>
    </div>
  )
}
