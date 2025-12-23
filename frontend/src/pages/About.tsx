import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Heart, Award } from "lucide-react";
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            About Aqua Guide
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Your trusted companion in the world of aquatic excellence
          </p>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-muted-foreground text-center mb-8">
            Aqua Guide was created by passionate aquarists for aquarists. We
            believe that fishkeeping is both an art and a science, and our
            mission is to make this incredible hobby accessible to everyone,
            from complete beginners to experienced enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-3" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To provide comprehensive, reliable, and accessible resources
                that empower aquarists to create thriving aquatic ecosystems and
                build a supportive community.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="h-10 w-10 text-primary mb-3" />
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We prioritize animal welfare, environmental responsibility, and
                knowledge sharing. Every guide and recommendation is backed by
                science and real-world experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-3" />
              <CardTitle>Our Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                With thousands of active members worldwide, our community is a
                welcoming space for questions, advice, and celebrating the
                beauty of aquatic life together.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-10 w-10 text-primary mb-3" />
              <CardTitle>Expert Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our content is created by experienced aquarists, aquatic
                biologists, and industry professionals who are dedicated to
                sharing their expertise.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="ocean-gradient text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-white/90 mb-6">
              Be part of a thriving community of fish enthusiasts dedicated to
              creating beautiful and healthy aquatic environments.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-bold mb-1">10K+</div>
                <div className="text-xs sm:text-sm text-white/80">
                  Active Members
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold mb-1">500+</div>
                <div className="text-xs sm:text-sm text-white/80">
                  Guides & Tutorials
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-2xl sm:text-3xl font-bold mb-1">1000+</div>
                <div className="text-xs sm:text-sm text-white/80">
                  Species Documented
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
