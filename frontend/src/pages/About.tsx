import { Card, CardContent } from "@/components/ui/card";
import {
  Fish,
  Waves,
  Stethoscope,
  Carrot,
  BookOpen,
  Users,
} from "lucide-react";
import alexChen from "@/assets/alexchen.avif";
import maria from "@/assets/MariaGarcia.avif"
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken || refreshToken) {
      navigate("/");
    } else {
      navigate("/register");
    }
  };
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The Aqua Guide provides clear, practical resources to help you
            confidently care for your aquarium, whether you are just starting
            out or refining advanced setups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Fish className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Species Spotlights
              </h3>
              <p className="text-muted-foreground">
                Confidently choose the right fish with our guides on species’
                needs, temperament, and compatibility.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Waves className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Tank Setup & Water
              </h3>
              <p className="text-muted-foreground">
                Master the nitrogen cycle and maintain ideal water parameters
                with our step-by-step instructions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Stethoscope className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Disease & Treatment
              </h3>
              <p className="text-muted-foreground">
                Learn to identify, prevent, and effectively treat common fish
                diseases to keep your aquatic friends healthy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Carrot className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Nutrition Guidelines
              </h3>
              <p className="text-muted-foreground">
                Discover the best diets and feeding schedules to support vibrant
                and healthy fish.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Troubleshooting
              </h3>
              <p className="text-muted-foreground">
                Solve common problems like algae outbreaks, cloudy water, and
                equipment issues with proven solutions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Community & Support
              </h3>
              <p className="text-muted-foreground">
                Connect with fellow fish keepers to share experiences, ask
                questions, and learn together.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Meet Our Aquarists */}
        <div className="text-center mt-20 mb-12">
          <h2 className="text-3xl font-bold mb-3">Meet Our Aquarists</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The Aqua Guide is powered by a team of lifelong hobbyists who have
            turned their passion into a mission to help others.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20">
          <Card className="overflow-hidden">
            <img
            src={alexChen}
            alt="Alex Chen"
            className="w-full h-80 object-cover"
          />
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold">Alex Chen</h3>
              <p className="text-sm text-muted-foreground">
                Founder & Freshwater Expert
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <img
              src={maria}
              alt="Maria Garcia"
              className="w-full h-80 object-cover"
            />
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold">Maria Garcia</h3>
              <p className="text-sm text-muted-foreground">
                Saltwater & Coral Specialist
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Unwavering Commitment */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Our Unwavering Commitment
          </h2>
          <p className="text-muted-foreground mb-8">
            At The Aqua Guide, we are committed to providing accurate,
            up-to-date, and practical advice that makes fish keeping enjoyable
            and successful. Our content is crafted by experienced aquarists and
            reviewed for accuracy, ensuring you get the best guidance available.
          </p>

          <button className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition"
          onClick={handleClick}>
            Start Your Journey →
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
