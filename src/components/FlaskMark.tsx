export function FlaskMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="flaskGrad" x1="4" y1="4" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#18D4D0" />
          <stop offset="0.55" stopColor="#8E4DFF" />
          <stop offset="1" stopColor="#F72585" />
        </linearGradient>
      </defs>
      <path
        d="M9.5 3h5M10 3v6.2l-5.1 8.5A2.4 2.4 0 0 0 7 21.5h10a2.4 2.4 0 0 0 2.1-3.8L14 9.2V3"
        stroke="url(#flaskGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10.2" cy="16.4" r="1" fill="#18D4D0" />
      <circle cx="13.6" cy="18" r="0.8" fill="#F72585" />
      <circle cx="12.4" cy="14.2" r="0.7" fill="#8E4DFF" />
    </svg>
  );
}
