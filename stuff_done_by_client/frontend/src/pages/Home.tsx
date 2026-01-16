import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-aquarium_slide1.webp";
import slider2 from "@/assets/slider-2.webp";
import slider3 from "@/assets/slider-3.webp";
import slider4 from "@/assets/slider-4.webp";
import { TankVolumeCalculator } from "@/components/tools/TankVolumeCalculator";
import { WaterParameters } from "@/components/tools/WaterParameter";
import { FeedingSchedule } from "@/components/tools/FeedingSchedule";
import { SubstrateCalculator } from "@/components/tools/SubstrateCalculator";
import { HeaterWattageGuide } from "@/components/tools/HeaterWattageGuide";
import { CompatibilityMatrix } from "@/components/tools/CompatibilityMatrix";
import { WaterChangeCalculator } from "@/components/tools/WaterChangeCalculator";
import { CO2BubbleCounter } from "@/components/tools/CO2BubbleCounter";
import { BioloadCalculator } from "@/components/tools/BioloadCalculator";
import { DosingCalculator } from "@/components/tools/DosingCalculator";
import { GoldenRatioOverlay } from "@/components/tools/GoldenRatioOverlay";
import { FishNameConverter } from "@/components/tools/FishNameConverter";
import { HardscapeCalculator } from "@/components/tools/HardscapeCalculator";
import { DiagnosticWizard } from "@/components/tools/DiagnosticWizard";
import { MedicationDosager } from "@/components/tools/MedicationDosager";
import { ElectricityCostEstimator } from "@/components/tools/ElectricityCostEstimator";
import { LightIntensityEstimator } from "@/components/tools/LightIntensityEstimator";
import { StatsOverlay } from "@/components/StatsOverlay";
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
  Layers,
  Thermometer,
  HeartHandshake,
  RefreshCw,
  Wind,
  Scale,
  FlaskConical,
    Frame,
  Search,
  Mountain,
  Stethoscope,
  Pill,
  Zap,
  Sun,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthModalOpen, setAuthModalView } from "@/store/userSlice";

const sliderContent = [
  {
    image: heroImage,
    title: "Deep Dive :: Fish Keeping",
    description:
      "Your comprehensive guide to thriving aquariums. Master every aspect, from setup to breeding.",
  },
  {
    image: slider2,
    title: "Expert Video Tutorials",
    description:
      "Learn from experienced aquarists with step-by-step video guides for all skill levels.",
  },
  {
    image: slider3,
    title: "Vibrant Community",
    description:
      "Connect with thousands of fish keepers, share experiences, and get instant advice.",
  },
  {
    image: slider4,
    title: "Species Encyclopedia",
    description:
      "Explore our comprehensive database of aquatic species with detailed care requirements.",
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();

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
      <div className="relative group">
        <section className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
        {sliderContent.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent">
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl space-y-4 md:space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Link to="/text-guides">
                      <Button
                        size="lg"
                        variant="ocean"
                        className="w-full sm:w-auto"
                      >
                        Explore Fish Guides
                      </Button>
                    </Link>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        dispatch(setAuthModalView("register"));
                        dispatch(setAuthModalOpen(true));
                      }}
                    >
                      Join Our Community
                    </Button>
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
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-primary" : "w-2 bg-primary/30"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
        </section>
        {/* Real-time Stats Overlay */}
        <div className="relative z-20 w-full md:absolute md:bottom-4 md:right-4 md:w-auto">
          <StatsOverlay />
        </div>
      </div>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12">
            Why Choose Aqua Guide?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: Video,
                title: "Video Guides",
                description: "Step-by-step video tutorials from experts",
              },
              {
                icon: BookOpen,
                title: "Text Guides",
                description: "Detailed written guides for all topics",
              },
              {
                icon: Users,
                title: "Community",
                description: "Connect with fellow aquarists worldwide",
              },
              {
                icon: MessageSquare,
                title: "Live Chat",
                description: "Real-time discussions and support",
              },
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

      {/* Aquarist Tools */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12">
            Aquarist Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <TankVolumeCalculator>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <Calculator className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">
                    Tank Volume Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate your tank capacity
                  </CardDescription>
                </CardHeader>
              </Card>
            </TankVolumeCalculator>

            <SubstrateCalculator>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <Layers className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">Substrate Calculator</CardTitle>
                  <CardDescription>
                    Calculate required substrate amount
                  </CardDescription>
                </CardHeader>
              </Card>
            </SubstrateCalculator>

            <HeaterWattageGuide>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <Thermometer className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">Heater Wattage Guide</CardTitle>
                  <CardDescription>
                    Find the right heater for your tank
                  </CardDescription>
                </CardHeader>
              </Card>
            </HeaterWattageGuide>

            <CompatibilityMatrix>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <HeartHandshake className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">Compatibility Matrix</CardTitle>
                  <CardDescription>
                    Check fish compatibility
                  </CardDescription>
                </CardHeader>
              </Card>
            </CompatibilityMatrix>

            <FeedingSchedule>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <Calendar className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">Feeding Schedule</CardTitle>
                  <CardDescription>Plan your feeding routine</CardDescription>
                </CardHeader>
              </Card>
            </FeedingSchedule>

            <WaterChangeCalculator>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <RefreshCw className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">Water Change Calculator</CardTitle>
                  <CardDescription>
                    Nitrate-based water change guide
                  </CardDescription>
                </CardHeader>
              </Card>
            </WaterChangeCalculator>

            <CO2BubbleCounter>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <Wind className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">CO2 Bubble Counter</CardTitle>
                  <CardDescription>
                    Calculate CO2 injection rate
                  </CardDescription>
                </CardHeader>
              </Card>
            </CO2BubbleCounter>

            <BioloadCalculator>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <Scale className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">Bioload Calculator</CardTitle>
                  <CardDescription>
                    Calculate stocking level by biomass
                  </CardDescription>
                </CardHeader>
              </Card>
            </BioloadCalculator>

            <DosingCalculator>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <FlaskConical className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">Dosing Calculator</CardTitle>
                  <CardDescription>
                    Calculate fertilizer dosing
                  </CardDescription>
                </CardHeader>
              </Card>
            </DosingCalculator>
			{/* New Tools Batch 2 */}
            <GoldenRatioOverlay>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <Frame className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">Golden Ratio Overlay</CardTitle>
                  <CardDescription>
                    Aquascaping composition tool
                  </CardDescription>
                </CardHeader>
              </Card>
            </GoldenRatioOverlay>

            <FishNameConverter>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <Search className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">Fish Name Converter</CardTitle>
                  <CardDescription>
                    Common to Scientific names
                  </CardDescription>
                </CardHeader>
              </Card>
            </FishNameConverter>

            <HardscapeCalculator>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <Mountain className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">Hardscape Displacer</CardTitle>
                  <CardDescription>
                    Calculate rock & wood volume
                  </CardDescription>
                </CardHeader>
              </Card>
            </HardscapeCalculator>

            <DiagnosticWizard>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <Stethoscope className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">Diagnostic Wizard</CardTitle>
                  <CardDescription>
                    Identify plants & algae issues
                  </CardDescription>
                </CardHeader>
              </Card>
            </DiagnosticWizard>

            <MedicationDosager>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <Pill className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">Medication Dosager</CardTitle>
                  <CardDescription>
                    Safe dosing calculator
                  </CardDescription>
                </CardHeader>
              </Card>
            </MedicationDosager>

            <ElectricityCostEstimator>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <Zap className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">Energy Cost Estimator</CardTitle>
                  <CardDescription>
                    Calculate running costs
                  </CardDescription>
                </CardHeader>
              </Card>
            </ElectricityCostEstimator>

            <LightIntensityEstimator>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <Sun className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">Light Intensity (PAR)</CardTitle>
                  <CardDescription>
                    Estimate lighting strength
                  </CardDescription>
                </CardHeader>
              </Card>
            </LightIntensityEstimator>
            <WaterParameters>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <Droplets className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-lg">Water Parameters</CardTitle>
                  <CardDescription>
                    Check ideal ranges for species
                  </CardDescription>
                </CardHeader>
              </Card>
            </WaterParameters>
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
