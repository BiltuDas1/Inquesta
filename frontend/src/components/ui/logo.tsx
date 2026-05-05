export const Logo = () => {
  return (
    <a href="/" className="flex items-center gap-3 no-underline shrink-0">
      <div className="w-10 h-10 rounded-xl bg-[#1a3a35] flex items-center justify-center shrink-0">
        <img className="h-8" src="/favicon.svg" alt="Inquesta Logo" />
      </div>
      <span className="text-white text-xl font-semibold tracking-wide">
        Inquesta
      </span>
    </a>
  );
};
