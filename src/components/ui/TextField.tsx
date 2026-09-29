import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { asset } from '@/lib/asset'

/*
 * Text field — Figma "Text Fields with Icon" (16:1144) and "Text without Icon" (16:1169).
 *   Size:   Large | Small | Compact (56px contact-form field; Small's Figma typography)
 *   States: Default | While Entering (mapped to :focus-within)
 */

type Size = 'large' | 'small' | 'compact'

type SharedProps = {
  /** Visible placeholder; also used as the accessible label. */
  label: string
  size?: Size
  /** Leading account icon in Alchemy colour ("Text Fields with Icon"). */
  withIcon?: boolean
  /** Validation message shown under the field (red border, aria-invalid, aria-describedby). */
  error?: string
  className?: string
}

const container: Record<Size, string> = {
  large: 'rounded-[24px] p-12',
  small: 'rounded-[16px] p-6',
  compact: 'rounded-[16px] px-6 py-4',
}

const text: Record<Size, string> = {
  large: 'text-[20px] leading-[1.2] font-light placeholder:text-text-ultra-light',
  small: 'text-[16px] leading-[1.2] font-light placeholder:text-text-ultra-light',
  /* Figma "Text without Icon" Small: Forma DJR Micro Light 16/1.2, Ultra Light placeholder. */
  compact: 'text-[16px] leading-[1.2] font-light placeholder:text-text-ultra-light',
}

const wrapperBase = 'flex w-full border bg-light-grey'

const controlBase = 'w-full min-w-0 bg-transparent font-sans text-text-dark focus:outline-none'

/* Border: none at rest, Stroke Light while entering; Negative (at rest and focused) when invalid. */
const border = (error?: string) =>
  error ? 'border-negative' : 'border-transparent focus-within:border-stroke-light'

/** The field with its error message under it (the same style as the attachment's). */
function WithError({ id, error, children }: { id: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-2">
      {children}
      {error && (
        <p id={id} className="text-negative px-2 font-sans text-[14px]">
          {error}
        </p>
      )}
    </div>
  )
}

function AccountIcon({ size }: { size: Size }) {
  const px = size === 'large' ? 24 : 20
  const inner = size === 'large' ? 19 : 15.833
  return (
    <span aria-hidden className="relative shrink-0" style={{ width: px, height: px }}>
      <img
        alt=""
        src={asset('/assets/icons/account-circle.png')}
        width={inner}
        height={inner}
        className="absolute"
        style={{ width: inner, height: inner, left: (px - inner) / 2, top: (px - inner) / 2 }}
      />
    </span>
  )
}

export function TextField({
  label,
  size = 'large',
  withIcon = false,
  error,
  className,
  ...inputProps
}: SharedProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <WithError id={errorId} error={error}>
      <div
        className={cn(
          wrapperBase,
          container[size],
          size === 'large' && 'h-[120px] items-start',
          size === 'compact' && 'h-14',
          size !== 'large' && 'items-center',
          border(error),
          className,
        )}
      >
        <div className={cn('flex w-full items-center', size === 'large' ? 'gap-4' : 'gap-2')}>
          {withIcon && <AccountIcon size={size} />}
          <label htmlFor={id} className="sr-only">
            {label}
          </label>
          <input
            id={id}
            placeholder={label}
            className={cn(controlBase, text[size])}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            {...inputProps}
          />
        </div>
      </div>
    </WithError>
  )
}

export function TextArea({
  label,
  size = 'large',
  error,
  className,
  ...textareaProps
}: Omit<SharedProps, 'withIcon'> & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <WithError id={errorId} error={error}>
      <div className={cn(wrapperBase, container[size], border(error), className)}>
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <textarea
          id={id}
          placeholder={label}
          className={cn(controlBase, text[size], 'h-full resize-none')}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...textareaProps}
        />
      </div>
    </WithError>
  )
}
