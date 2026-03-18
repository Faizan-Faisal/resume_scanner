export const inp = "w-full rounded-lg px-4 py-3 text-sm outline-none border transition-all duration-200 font-dm";
export const inpFocus = (e) => {
  e.currentTarget.style.borderColor = 'var(--accent)';
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,126,255,0.1)';
};
export const inpBlur = (e) => {
  e.currentTarget.style.borderColor = 'var(--border)';
  e.currentTarget.style.boxShadow = 'none';
};

