/** Loading indicator from the Button "State=Loading" variant (Figma 16:1074). */
export function Spinner() {
  return (
    <span aria-hidden className="relative block h-5 w-[19.931px] shrink-0 animate-spin">
      <span className="absolute top-0 left-[1.48px] flex h-5 w-[16.971px] items-center justify-center">
        <span className="relative block h-[17.313px] w-[10.044px] rotate-[27.86deg]">
          <img
            alt=""
            src="/assets/icons/spinner-arc.svg"
            className="absolute inset-[-36.34%_-62.63%] block max-w-none"
          />
        </span>
      </span>
      <img
        alt=""
        src="/assets/icons/spinner-ring.png"
        width={18.68}
        height={18.68}
        className="absolute top-[0.58px] left-[0.46px] size-[18.68px]"
      />
    </span>
  )
}
