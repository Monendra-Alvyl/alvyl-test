import { useEffect, useId, useRef, useState } from 'react'
import { Link } from '@/lib/router'
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
 * Sticks to the top of the viewport. Up to 600px (where the inline links no longer fit) the links
 * move into a hamburger menu: a card that drops out from under the header, aligned right.
 */
export function Header() {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const wrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    const onPointer = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false)
    }
    const wide = window.matchMedia('(min-width: 601px)')
    const onResize = () => wide.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    wide.addEventListener('change', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      wide.removeEventListener('change', onResize)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <div ref={wrapper} className="sticky top-3 z-50">
      <header
        className={cn(
          'border-stroke-light relative z-10 flex items-center justify-between overflow-clip rounded-[24px] border px-6 py-4 backdrop-blur-[12px]',
          open ? 'bg-pitch-black' : 'bg-btn-secondary',
        )}
      >
        <Link to="/" aria-label="Alvyl home" className="shrink-0" onClick={close}>
          <img
            src={asset('/assets/brand/logo.svg')}
            alt="Alvyl"
            width={58}
            height={40}
            className="h-8 w-[46.4px] md:h-10 md:w-[58px]"
          />
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-10 max-[600px]:hidden">
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
          className="-mr-2 flex size-10 items-center justify-center text-white min-[601px]:hidden"
        >
          <MenuIcon open={open} />
        </button>
      </header>

      {/* Mobile menu: its top edge tucks under the header card. */}
      <nav
        id={menuId}
        aria-label="Primary"
        hidden={!open}
        className="border-stroke-light bg-pitch-black absolute top-[calc(100%-24px)] right-0 flex flex-col items-start gap-8 rounded-b-[24px] border border-t-0 px-4 pt-12 pb-4 min-[601px]:hidden"
      >
        <ul className="text-body-lg flex flex-col gap-8 px-2 font-sans font-medium text-white">
          {primaryNav.map((link) => (
            <li key={link.label}>
              <SmartLink href={link.href} onClick={close}>
                {link.label}
              </SmartLink>
            </li>
          ))}
        </ul>
        <Button variant="secondary" href={headerCta.href} onClick={close}>
          {headerCta.label}
        </Button>
      </nav>
    </div>
  )
}
