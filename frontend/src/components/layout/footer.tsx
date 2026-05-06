export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full py-12 bg-background border-t border-outline-variant text-sm">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto space-y-8 md:space-y-0">
        <div className="flex justify-center items-center gap-2">
          <img className="h-8" src="/favicon.svg" />
          <span className="text-xl font-bold text-on-surface">Inquesta</span>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-on-surface-variant">
          {[
            // { name: "Terms of Service", url: "", new_tab: false },
            // { name: "Privacy Policy", url: "", new_tab: false },
            {
              name: "Instagram",
              url: "https://www.instagram.com/inquestasolutions/",
              new_tab: true,
            },
            {
              name: "LinkedIn",
              url: "https://www.linkedin.com/company/inquesta-solutions/",
              new_tab: true,
            },
            {
              name: "X",
              url: "https://x.com/InquestaSol",
              new_tab: true,
            },
          ].map((data) => (
            <a
              key={data.name}
              className="hover:text-primary transition-colors"
              href={data.url.length > 0 ? data.url : "#"}
              target={data.new_tab === true ? "_blank" : "_parent"}
            >
              {data.name}
            </a>
          ))}
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-on-surface-variant text-center">
            © {currentYear} Inquesta Solutions LLP. All rights reserved.
          </p>
          <p className="text-on-surface-variant flex items-center gap-1 justify-end">
            <span className="material-symbols-outlined text-[14px] opacity-70">
              verified_user
            </span>
            A Registered MSME Enterprise
          </p>
        </div>
      </div>
    </footer>
  );
};
