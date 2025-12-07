import { LoginForm } from "@/components/login-form";
import loginImage from "@/assets/images/login.png";
import logo from "@/assets/logos/logo.png";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function LoginPage() {
  return (
    <div className="min-h-svh bg-linear-to-br from-emerald-50 via-green-50 to-lime-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-emerald-300/60 rounded-full animate-pulse shadow-emerald-200/50 shadow-lg"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-green-300/70 rounded-full animate-bounce delay-300 shadow-green-200/50 shadow-md"></div>
        <div className="absolute bottom-32 left-20 w-5 h-5 bg-lime-300/50 rounded-full animate-pulse delay-500 shadow-lime-200/50 shadow-lg"></div>
        <div className="absolute top-60 left-1/3 w-3 h-3 bg-emerald-400/60 rounded-full animate-bounce delay-700 shadow-emerald-200/50 shadow-md"></div>
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-green-400/50 rounded-full animate-pulse delay-1000 shadow-green-200/40 shadow-sm"></div>
        <div className="absolute bottom-20 right-32 w-4 h-4 bg-lime-400/40 rounded-full animate-bounce delay-1200 shadow-lime-200/40 shadow-md"></div>

        <div className="absolute top-16 left-1/4 w-3 h-6 bg-emerald-300/40 rounded-full rotate-45 animate-pulse delay-800"></div>
        <div className="absolute bottom-40 right-1/3 w-4 h-8 bg-green-300/30 rounded-full -rotate-12 animate-bounce delay-1400"></div>
      </div>

      <div className="grid min-h-svh lg:grid-cols-2 relative z-10">
        <div className="flex flex-col gap-4 p-6 md:p-10 bg-linear-to-br from-white/85 via-emerald-50/70 to-green-50/60 backdrop-blur-sm">
          <div className="flex justify-center gap-2 md:justify-start mb-8">
            <div className="flex items-center gap-4">
              {/* Magical floating logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping"></div>
                <div className="absolute -inset-1 bg-linear-to-r from-emerald-400 via-green-400 to-lime-400 rounded-full opacity-75 blur-sm"></div>
                <div className="relative size-16 rounded-full overflow-hidden shadow-2xl shadow-emerald-500/30 transform hover:scale-110 hover:rotate-6 transition-all duration-700 border-4 border-white/50 backdrop-blur-sm">
                  <LazyLoadImage
                    src={logo}
                    alt="SeaVentures Logo"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-tr from-emerald-200/20 via-transparent to-cyan-200/20 rounded-full"></div>
                </div>
              </div>
              <div className="text-3xl font-bold bg-linear-to-r from-emerald-600 via-green-600 to-lime-600 bg-clip-text text-transparent drop-shadow-lg">
                SeaVentures
              </div>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-emerald-200/30 border-2 border-emerald-100/60 p-8 relative overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
              {/* Magical glow effect */}
              <div className="absolute inset-0 bg-linear-to-br from-emerald-100/40 via-transparent to-green-100/40 rounded-3xl"></div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-200/30 rounded-full animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-green-200/30 rounded-full animate-pulse"></div>

              <div className="relative z-10 text-center mb-8">
                <h1 className="text-3xl font-bold text-emerald-700 mb-3 drop-shadow-sm">
                  Welcome to the Forest
                </h1>
                <p className="text-emerald-600/90 text-sm leading-relaxed font-light">
                  Return to the enchanted woodlands where ancient spirits guide your journey
                </p>
              </div>

              <div className="relative z-10">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-t from-emerald-600/30 via-green-500/20 to-lime-300/25 z-10"></div>

          <div className="absolute inset-2 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/30">
            <LazyLoadImage
              src={loginImage}
              alt="Magical Forest Landscape"
              className="h-full w-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
            />
          </div>

          <div className="absolute bottom-8 left-8 right-8 z-20">
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30 shadow-2xl shadow-emerald-900/20 transform hover:scale-[1.02] transition-all duration-500">
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-emerald-300/50 rounded-full animate-pulse"></div>
              <p className="text-white text-xl italic font-light leading-relaxed drop-shadow-lg">
                "The creation of a single world comes from a huge number of
                fragments and chaos."
              </p>
              <p className="text-emerald-100/90 text-base mt-3 font-medium drop-shadow-sm">
                — Hayao Miyazaki
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
