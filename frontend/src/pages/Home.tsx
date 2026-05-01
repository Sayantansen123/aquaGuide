import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  BookOpen,
  Users,
  MessageSquare,
  Calculator,
  Droplets,
  Calendar,
  Fish,
} from "lucide-react";
import { Link } from "react-router-dom";



import { JigsawPuzzle } from "@/components/JigsawPuzzle";


function TypewriterText({ text, speed = 50 }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayed("");

    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;

      if (i > text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

const sliderContent = [
  {
    image: "/cats.mp4",
    type: "video",
    title: "Discover Your Perfect Pet",
    description:
      "Explore a world of pets and learn what fits your lifestyle best — from cats and dogs to exotic companions.",
  },
  {
    image: "/dogs.mp4",
    type: "video",
    title: "Expert Care & Training Guides",
    description:
      "Step-by-step video tutorials from pet experts to help you raise happy, healthy animals.",
  },
  {
    image: "/scene1.mp4",
    type: "video",
    title: "Explore Animal Species Library",
    description:
      "Dive into a rich encyclopedia of pets, wildlife, and exotic species with detailed insights.",

  },
  {
    image: "/scene2.mp4",
    type: "video",
    title: "Connect with Pet Lovers",
    description:
      "Join a vibrant community of animal lovers, share experiences, and get real-time advice.",
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderContent.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderContent.length) % sliderContent.length
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
        {sliderContent.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >

            {index === currentSlide && (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={slide.image} type="video/mp4" />
              </video>
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-background/20 to-transparent">
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="w-full flex flex-col gap-6">
                  <div className="max-w-2xl space-y-4 md:space-y-6">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                      <TypewriterText key={currentSlide} text={slide.description} />
                    </p>

                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Link to="/text-guides">
                      <Button
                        size="lg"
                        variant="ocean"
                        className="w-full sm:w-auto"
                      >
                        Explore Pets Guides
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        Join Our Community
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full glass-effect"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full glass-effect"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {sliderContent.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${index === currentSlide ? "w-8 bg-primary" : "w-2 bg-primary/30"
                }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Features Section — Bubble Layout */}
      <section className="py-16 md:py-24  overflow-hidden">
        <style>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
          @keyframes float-medium {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-18px); }
          }
          @keyframes float-fast {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          .bubble-float-1 { animation: float-slow 6s ease-in-out infinite; }
          .bubble-float-2 { animation: float-medium 5s ease-in-out infinite 0.5s; }
          .bubble-float-3 { animation: float-fast 7s ease-in-out infinite 1s; }
          .bubble-float-4 { animation: float-slow 5.5s ease-in-out infinite 1.5s; }
          .bubble-item:hover {
            animation: pulse-ring 1.5s ease-out infinite;
          }
          .bubble-deco {
            position: absolute;
            border-radius: 50%;
            opacity: 0.08;
            background: hsl(32, 50%, 55%);
            pointer-events: none;
          }
          .dark .bubble-deco {
            background: hsl(186, 100%, 42%);
          }
        `}</style>

        <div className="container mx-auto px-4">
          {/* Section heading */}
          <div className="flex items-center justify-center gap-4 mb-12 md:mb-18">
            <img
              src="./pet.png"
              className="w-[55px] h-[55px]"
              alt=""
            />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Why Choose Us?
            </h2>
          </div>

          {/* Bubble container */}
          <div className="relative min-h-[320px] sm:min-h-[400px] md:min-h-[480px] xl:min-h-[420px]">
            {/* Decorative background bubbles */}
            <div className="bubble-deco w-[180px] h-[180px] -top-5 left-[18%] hidden xl:block" />
            <div className="bubble-deco w-[120px] h-[120px] top-1/2 right-[20%] hidden xl:block" />
            <div className="bubble-deco w-[90px] h-[90px] bottom-0 left-[30%] hidden xl:block" />
            <div className="bubble-deco w-[67px] h-[67px] top-4 right-[25%] hidden xl:block" />

            {/* Feature bubbles — responsive grid on small, positioned on large */}
            <div className="grid grid-cols-2 gap-6 sm:gap-8 xl:block">
              {[
                {
                  icon: Video,
                  title: "Video Guides",
                  description: "Step-by-step video tutorials from experts",
                  floatClass: "bubble-float-1",
                  positionClass: "xl:absolute xl:top-[15%] xl:left-[36%]",
                  gradient: "bubble-gradient-1",
                  size: "w-[150px] h-[150px] sm:w-[170px] sm:h-[170px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[200px] xl:h-[200px]",
                },
                {
                  icon: BookOpen,
                  title: "Text Guides",
                  description: "Detailed written guides for all topics",
                  floatClass: "bubble-float-2",
                  positionClass: "xl:absolute xl:top-[-4%] xl:right-[35%]",
                  gradient: "bubble-gradient-2",
                  size: "w-[150px] h-[150px] sm:w-[170px] sm:h-[170px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[220px] xl:h-[220px]",
                },
                {
                  icon: Users,
                  title: "Community",
                  description: "Connect with fellow aquarists worldwide",
                  floatClass: "bubble-float-3",
                  positionClass: "xl:absolute xl:bottom-[2%] xl:left-[40%]",
                  gradient: "bubble-gradient-3",
                  size: "w-[150px] h-[150px] sm:w-[170px] sm:h-[170px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[185px] xl:h-[185px]",
                },
                {
                  icon: MessageSquare,
                  title: "Live Chat",
                  description: "Real-time discussions and support",
                  floatClass: "bubble-float-4",
                  positionClass: "xl:absolute xl:bottom-[0%] xl:right-[30%]",
                  gradient: "bubble-gradient-4",
                  size: "w-[150px] h-[150px] sm:w-[170px] sm:h-[170px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[250px] xl:h-[250px]",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`flex justify-center xl:justify-start ${feature.positionClass}`}
                >
                  <div
                    className={`
                      bubble-item ${feature.floatClass}
                      ${feature.size}
                      rounded-full
                      flex flex-col items-center justify-center text-center
                      p-4 sm:p-5
                      cursor-pointer
                      transition-all duration-500
                      hover:scale-110
                      ${feature.gradient}
                      shadow-lg hover:shadow-2xl
                      backdrop-blur-sm
                      border border-white/20
                      group
                      relative
                    `}
                  >
                    {/* Glow ring on hover */}
                    <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-all duration-500" />

                    <feature.icon className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white mb-2 transition-transform duration-300 group-hover:scale-110 relative z-10" />
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight relative z-10">
                      {feature.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-white/80 mt-1 leading-snug max-w-[120px] sm:max-w-[140px] relative z-10">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*solve the jigsaw puzzle secction*/}
      <JigsawPuzzle />

      {/* Featured Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Latest Guides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Beginner's Guide to Planted Tanks",
                  "Understanding the Nitrogen Cycle",
                  "Best Community Fish Species",
                ].map((guide, i) => (
                  <div key={i} className="pb-4 border-b last:border-0">
                    <h4 className="font-medium hover:text-primary cursor-pointer transition-colors">
                      {guide}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      2 days ago
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Videos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Setting Up Your First Aquarium",
                  "Advanced Aquascaping Techniques",
                  "Breeding Betta Fish",
                ].map((video, i) => (
                  <div key={i} className="pb-4 border-b last:border-0">
                    <h4 className="font-medium hover:text-primary cursor-pointer transition-colors">
                      {video}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      15K views
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Buzz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Help! My fish are acting strange",
                  "Show off your newest additions",
                  "Best filter for 20 gallon tank?",
                ].map((post, i) => (
                  <div key={i} className="pb-4 border-b last:border-0">
                    <h4 className="font-medium hover:text-primary cursor-pointer transition-colors">
                      {post}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      24 replies
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Latest Posts */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12">
            Latest from Aqua Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: "Maintaining Crystal Clear Water",
                category: "Water Chemistry",
                date: "Jan 15, 2025",
              },
              {
                title: "Top 10 Beginner Fish Species",
                category: "Species Guide",
                date: "Jan 12, 2025",
              },
              {
                title: "Building a Biotope Aquarium",
                category: "Aquascaping",
                date: "Jan 10, 2025",
              },
            ].map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-xs font-medium text-primary mb-2">
                    {post.category}
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription>{post.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0">
                    Read More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6">
            Have Questions?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
            Our community is here to help! Join thousands of aquarists sharing
            their knowledge and experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="ocean" className="w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
            <Link to="/faq">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View FAQ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
