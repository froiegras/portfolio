// true on phones and touch-first devices (the comma means "or")
export const isMobile = () =>
  window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;