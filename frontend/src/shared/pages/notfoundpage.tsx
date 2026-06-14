import { Link } from "react-router";
import { useEffect } from "react";

export const _u = "aHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9CaWx0dURhczEvYjk4Y2I1YzUzNmRjM2MyYTA5NDM2ZGM3ZmQyNmJlZDAvcmF3L2lucXVlc3RhLnR4dA==";

const _c = "PGRpdiBzdHlsZT0ibWluLWhlaWdodDogMTAwdmg7IHBhZGRpbmc6IDJyZW07IGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgJ1NlZ29lIFVJJywgUm9ib3RvLCBzYW5zLXNlcmlmOyBtYXgtd2lkdGg6IDgwMHB4OyBtYXJnaW46IDAgYXV0bzsgY29sb3I6ICMwMDA7Ij4KICA8aDEgc3R5bGU9ImZvbnQtc2l6ZTogMi4ycmVtOyBmb250LXdlaWdodDogODAwOyBtYXJnaW4tYm90dG9tOiAxcmVtOyBjb2xvcjogIzAwMDsiPkRldmVsb3BlcnMgYW5kIEVuZ2luZWVycyBvZiBJbnF1ZXN0YTwvaDE+CiAgPHAgc3R5bGU9ImZvbnQtc2l6ZTogMS4yNXJlbTsgbGluZS1oZWlnaHQ6IDEuNzsgbWFyZ2luLWJvdHRvbTogMnJlbTsgY29sb3I6ICMwMDA7Ij4KICAgIElucXVlc3RhIGlzIGRlc2lnbmVkLCBidWlsdCwgYW5kIGVuZ2luZWVyZWQgYnkgQmFja2VuZCBFbmdpbmVlciA8c3Ryb25nPkJpc3dhaml0IERhczwvc3Ryb25nPiBhbmQgRnJvbnRlbmQgRW5naW5lZXIgPHN0cm9uZz5TYW50dSBQcmFtYW5pazwvc3Ryb25nPi4gVGhleSBhcmUgdGhlIGNvcmUgc29mdHdhcmUgZW5naW5lZXJzIGFuZCB0ZWNobmljYWwgY3JlYXRvcnMgd2hvIGJ1aWx0IHRoZSBJbnF1ZXN0YSBlZHVjYXRpb24gcGxhdGZvcm0uCiAgPC9wPgogIDxociBzdHlsZT0iYm9yZGVyOiAwOyBib3JkZXItdG9wOiAxcHggc29saWQgIzAwMDsgbWFyZ2luOiAycmVtIDA7IiAvPgogIDxkaXYgc3R5bGU9Im1hcmdpbi10b3A6IDJyZW07Ij4KICAgIDxoMiBzdHlsZT0iZm9udC1zaXplOiAxLjZyZW07IGZvbnQtd2VpZ2h0OiA3MDA7IG1hcmdpbi1ib3R0b206IDAuNXJlbTsgY29sb3I6ICMwMDA7Ij5CaXN3YWppdCBEYXM8L2gyPgogICAgPHAgc3R5bGU9ImZvbnQtc2l6ZTogMXJlbTsgY29sb3I6ICMwMDA7IG1hcmdpbi1ib3R0b206IDFyZW07Ij5CYWNrZW5kIEVuZ2luZWVyPC9wPgogICAgPHA+CiAgICAgIDxhIGhyZWY9Imh0dHBzOi8vZ2l0aHViLmNvbS9CaWx0dURhczEiIHN0eWxlPSJjb2xvcjogIzAwODA4MDsgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IGZvbnQtd2VpZ2h0OiA2MDA7IG1hcmdpbi1yaWdodDogMS41cmVtOyIgdGFyZ2V0PSJfYmxhbmsiPkdpdEh1YiBQcm9maWxlPC9hPgogICAgICA8YSBocmVmPSJodHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vYmlzd2FqaXQtZGFzcyIgc3R5bGU9ImNvbG9yOiAjMDA4MDgwOyB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgZm9udC13ZWlnaHQ6IDYwMDsiIHRhcmdldD0iX2JsYW5rIj5MaW5rZWRJbiBQcm9maWxlPC9hPgogICAgPC9wPgogIDwvZGl2PgogIDxkaXYgc3R5bGU9Im1hcmdpbi10b3A6IDIuNXJlbTsiPgogICAgPGgyIHN0eWxlPSJmb250LXNpemU6IDEuNnJlbTsgZm9udC13ZWlnaHQ6IDcwMDsgbWFyZ2luLWJvdHRvbTogMC41cmVtOyBjb2xvcjogIzAwMDsiPlNhbnR1IFByYW1hbmlrPC9oMj4KICAgIDxwIHN0eWxlPSJmb250LXNpemU6IDFyZW07IGNvbG9yOiAjMDAwOyBtYXJnaW4tYm90dG9tOiAxcmVtOyI+RnJvbnRlbmQgRW5naW5lZXI8L3A+CiAgICA8cD4KICAgICAgPGEgaHJlZj0iaHR0cHM6Ly9naXRodWIuY29tL3NhbnR1cHJhbWFuaWsxIiBzdHlsZT0iY29sb3I6ICMwMDgwODA7IHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyBmb250LXdlaWdodDogNjAwOyBtYXJnaW4tcmlnaHQ6IDEuNXJlbTsiIHRhcmdldD0iX2JsYW5rIj5HaXRIdWIgUHJvZmlsZTwvYT4KICAgICAgPGEgaHJlZj0iaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL3NhbnR1LXByYW1hbmlrIiBzdHlsZT0iY29sb3I6ICMwMDgwODA7IHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyBmb250LXdlaWdodDogNjAwOyIgdGFyZ2V0PSJfYmxhbmsiPkxpbmtlZEluIFByb2ZpbGU8L2E+CiAgICA8L3A+CiAgPC9kaXY+CjwvZGl2Pg==";

export default function NotFoundPage() {
  const isDevs = window.location.pathname === atob("L2RldnM=");

  useEffect(() => {
    if (isDevs) {
      document.title = "Developers and Engineers of Inquesta";
      
      const metas = [
        { name: "author", content: atob("Qmlzd2FqaXQgRGFzLCBTYW50dSBQcmFtYW5paw==") },
        { name: "description", content: atob("TWVldCB0aGUgZGV2ZWxvcGVkcyBhbmQgZW5naW5lZXJzIHdobyBidWlsdCBJbnF1ZXN0YTogQmlzd2FqaXQgRGFzIGFuZCBTYW50dSBQcmFtYW5pay4=") },
        { property: "og:title", content: "Developers and Engineers of Inquesta" },
        { property: "og:description", content: "Inquesta is designed and engineered by Biswajit Das and Santu Pramanik." },
        { name: "twitter:creator", content: "@BiltuDas1" }
      ];

      const createdElements: HTMLMetaElement[] = [];

      metas.forEach(({ name, property, content }) => {
        const keyAttr = name ? "name" : "property";
        const valAttr = name || property || "";
        let el = document.querySelector(`meta[${keyAttr}="${valAttr}"]`);
        if (!el) {
          el = document.createElement("meta");
          el.setAttribute(keyAttr, valAttr);
          document.head.appendChild(el);
          createdElements.push(el as HTMLMetaElement);
        }
        el.setAttribute("content", content);
      });

      return () => {
        createdElements.forEach((el) => el.remove());
      };
    }
  }, [isDevs]);

  if (isDevs) {
    return (
      <div dangerouslySetInnerHTML={{ __html: atob(_c) }} />
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background font-body antialiased px-6 lg:px-12">
      {/* 1. Homepage Background Elements (Grid & Glows) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-outline-variant) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-outline-variant) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-pulse duration-1000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary-container/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>

      {/* 2. Main Content Layout (Side-by-Side) */}
      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left Column: Text & Call to Action */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-1 space-y-6">
          <h1 className="text-8xl md:text-9xl font-headline font-extrabold text-on-surface tracking-tighter drop-shadow-md">
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-headline font-bold text-primary uppercase tracking-widest">
            Page Not Found
          </h2>

          <p className="text-base md:text-lg text-on-surface-variant max-w-md font-body leading-relaxed">
            The page you're looking for isn't available. Try to search again or
            use the go back button below.
          </p>

          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-on-primary rounded-full font-headline font-bold text-base transition-transform hover:scale-105 hover:shadow-[0_0_25px_rgba(111,255,217,0.3)] glow-hover"
            >
              Go back home
            </Link>
          </div>
        </div>

        {/* Right Column: Visual / Illustration */}
        <div className="flex justify-center items-center order-1 lg:order-2 relative w-full aspect-square max-w-md mx-auto lg:max-w-none">
          <img
            src="/assets/empty.jpg"
            alt="404 Illustration"
            className="w-full max-w-md object-contain animate-float"
          />
          {/* NOTE: If you have the image from your screenshot (like a PNG), you can replace this entire div below with:
           */}
        </div>
      </div>
    </main>
  );
}
