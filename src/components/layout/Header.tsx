import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { SmartLink } from '@/components/ui/SmartLink'
import { headerCta, primaryNav } from '@/data/site'
import { cn } from '@/lib/cn'
import { asset } from '@/lib/asset'

/** Three-line menu icon that turns into a close (×) icon when the menu is open. */
function MenuIcon({ open }: { open: boolean }) {
  const line =
    'absolute left-0 h-[2px] w-6 rounded-full bg-current transition-transform duration-200'
  return (
    <span aria-hidden className="relative block h-4 w-6">
      <span className={cn(line, 'top-0', open && 'translate-y-[7px] rotate-45')} />
      <span className={cn(line, 'top-[7px] transition-opacity', open && 'opacity-0')} />
      <span className={cn(line, 'top-[14px]', open && '-translate-y-[7px] -rotate-45')} />
    </span>
  )
}

/**
 * Site header — Figma 17:321 (desktop), 17:659 (tablet), 383:853 (mobile).
 * Sticks to the top of the viewport. Below the tablet breakpoint the links collapse into a
 * hamburger menu that expands inside the header card.
 */
export function Header() {
  const [open, setOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    const desktop = window.matchMedia('(min-width: 768px)')
    const onResize = () => desktop.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header
      className={cn(
        'border-stroke-light sticky top-3 z-50 overflow-clip rounded-[24px] border px-6 py-4 backdrop-blur-[12px]',
        open ? 'bg-pitch-black' : 'bg-btn-secondary',
      )}
    >
      <div className="flex items-center justify-between">
        <Link to="/" aria-label="Alvyl home" className="shrink-0" onClick={close}>
          <img
            src={asset('/assets/brand/logo.svg')}
            alt="Alvyl"
            width={58}
            height={40}
            className="h-8 w-[46.4px] md:h-10 md:w-[58px]"
          />
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-10 max-md:hidden">
          <ul className="text-body-sm flex items-center gap-6 font-sans font-medium whitespace-nowrap text-white">
            {primaryNav.map((link) => (
              <li key={link.label}>
                <SmartLink href={link.href}>{link.label}</SmartLink>
              </li>
            ))}
          </ul>
          <Button variant="secondary" size="s" href={headerCta.href}>
            {headerCta.label}
          </Button>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
          className="-mr-2 flex size-10 items-center justify-center text-white md:hidden"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      <nav
        id={menuId}
        aria-label="Primary"
        hidden={!open}
        className="flex flex-col items-start gap-6 pt-6 pb-2 md:hidden"
      >
        <ul className="text-body-lg flex flex-col gap-4 font-sans font-medium text-white">
          {primaryNav.map((link) => (
            <li key={link.label}>
              <SmartLink href={link.href} onClick={close}>
                {link.label}
              </SmartLink>
            </li>
          ))}
        </ul>
        <Button variant="secondary" size="s" href={headerCta.href} onClick={close}>
          {headerCta.label}
        </Button>
      </nav>
    </header>
  )
}
