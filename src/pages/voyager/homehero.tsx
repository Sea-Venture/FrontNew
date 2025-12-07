import { Button } from "@/components/ui/button";
import VoyagerVideo from '../../assets/videos/voyager-video.mp4';

export default function HomeHero() {
  return (
    <section className="mb-6 sm:mb-8 relative overflow-hidden rounded-xl sm:rounded-2xl text-white min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">


      <video
        autoPlay
        muted
        loop
        playsInline
        className="hidden md:block absolute inset-0 w-full h-full object-cover"
        poster="/api/placeholder/1200/600"
      >
        <source src={VoyagerVideo} type="video/mp4" />

        <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-cyan-600 to-sky-600"></div>
      </video>

      <div className="md:hidden absolute inset-0">
        <img
          src="/api/placeholder/800/600"
          alt="Magical ocean scene"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-r from-blue-600/80 via-cyan-600/80 to-sky-600/80"></div>
      </div>


      <div className="absolute inset-0 bg-black/40"></div>

 
      <div className="relative z-10 p-4 sm:p-8 md:p-12 h-full flex items-center">
        <div className="max-w-full sm:max-w-2xl">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight drop-shadow-lg">
            Welcome to Your
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-orange-300 drop-shadow-lg">
              Magical Journey
            </span>
          </h2>
          <p className="text-sm sm:text-xl mb-4 sm:mb-6 text-blue-100 leading-relaxed drop-shadow-md">
            Discover enchanting stories, breathtaking adventures, and
            mystical worlds that will transport you beyond imagination.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              size="lg"
              className="bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white font-semibold text-sm sm:text-base px-4 sm:px-6 shadow-lg"
            >
              Start Exploring
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/80 text-blue-800 hover:bg-white/90 hover:text-blue-600 text-sm sm:text-base px-4 sm:px-6 shadow-lg"
            >
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden sm:block absolute top-4 sm:top-8 right-4 sm:right-8 opacity-20 z-10">
        <div className="w-16 sm:w-32 h-16 sm:h-32 rounded-full bg-linear-to-br from-cyan-300/40 to-blue-300/40 blur-xl animate-pulse shadow-2xl"></div>
      </div>
      <div className="hidden sm:block absolute bottom-4 sm:bottom-8 right-8 sm:right-16 opacity-15 z-10">
        <div className="w-12 sm:w-20 h-12 sm:h-20 rounded-full bg-linear-to-br from-sky-300/50 to-indigo-300/50 blur-lg animate-bounce shadow-2xl"></div>
      </div>
    </section>
  );
}