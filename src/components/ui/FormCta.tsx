import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'

/*
 * CTA on forms — Figma 16:1182.
 *   Sizes:  Large (180px tall) | Small (120px tall) | Bar (70px, contact form on Home)
 *   States: Active (Alchemy fill) | Disabled (#333 fill, 50% text)
 */

type FormCtaProps = {
  size?: 'large' | 'small' | 'bar'
  label?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export function FormCta({
  size = 'large',
  label = 'Send',
  type = 'submit',
  className,
  ...buttonProps
}: FormCtaProps) {
  const isLarge = size !== 'small'
  return (
    <button
      type={type}
      className={cn(
        'flex w-full flex-col items-center justify-center text-white',
        /* The bar variant's Alchemy fill runs left→right (orange → red) in the design. */
        size === 'bar'
          ? 'from-alchemy-1 to-alchemy-2 h-[70px] rounded-[16px] bg-linear-to-r px-6 shadow-[0_8px_24px_rgb(206_29_30/0.25)]'
          : 'bg-alchemy rounded-[24px] p-12',
        'disabled:bg-btn-primary-text disabled:bg-none disabled:text-white/50',
        size === 'large' && 'h-[180px]',
        size === 'small' && 'h-[120px]',
        className,
      )}
      {...buttonProps}
    >
      <span className={cn('flex items-center justify-center', isLarge ? 'gap-3' : 'gap-2')}>
        <Icon name="send" size={size === 'large' ? 24 : 20} />
        <span
          className={cn(
            'font-sans leading-none font-medium whitespace-nowrap',
            isLarge ? 'text-[20px]' : 'text-[16px]',
            size === 'bar' && 'tracking-[0.05em]',
          )}
        >
          {label}
        </span>
      </span>
    </button>
  )
}
