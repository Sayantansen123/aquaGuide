import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Fish,
  Thermometer,
  Droplets,
  Ruler,
  MapPin,
  Heart,
  Utensils,
  Users,
  Eye,
  Leaf,
} from "lucide-react";

// Mock fish data - in real app this would come from API
const mockFishData = {
  id: 1,
  commonName: "Betta Fish",
  scientificName: "Betta splendens",
  family: "Osphronemidae",
  origin: "Southeast Asia (Thailand, Cambodia, Vietnam)",
  waterType: "Freshwater",
  size: "2.5 - 3 inches (6-7.5 cm)",
  temperature: "75-82°F (24-28°C)",
  pH: "6.5 - 7.5",
  hardness: "3-4 dGH (50-66.7 ppm)",
  careLevel: "Easy",
  overview:
    "The Betta fish, also known as the Siamese fighting fish, is one of the most popular aquarium fish in the world. Known for their vibrant colors and flowing fins, bettas are native to the shallow waters of Thailand, Cambodia, and Vietnam. Male bettas are particularly famous for their aggressive behavior towards other males, which is why they should be housed alone or with compatible tank mates.",
  physicalCharacteristics:
    "Betta fish are known for their stunning appearance. Males display vibrant colors including red, blue, purple, green, and multicolored varieties. They have long, flowing fins that can come in various shapes including veil tail, crown tail, half-moon, and plakat. Females are typically smaller with shorter fins and less vibrant coloration. The average body length is 2.5-3 inches, though their flowing fins can make them appear much larger.",
  habitatRequirements:
    "Bettas thrive in warm, still or slow-moving water. A minimum tank size of 5 gallons is recommended, though larger is always better. They prefer densely planted tanks with plenty of hiding spots. Live plants like Java fern, Anubias, and Amazon sword are excellent choices. A gentle filter and heater are essential to maintain stable water conditions. Avoid strong currents as bettas are not strong swimmers.",
  careAndFeeding:
    "Bettas are carnivorous and should be fed a high-quality betta pellet as their staple diet. Supplement with frozen or live foods like bloodworms, brine shrimp, and daphnia 2-3 times per week. Feed small amounts 1-2 times daily, only what they can consume in 2-3 minutes. Overfeeding can lead to bloating and water quality issues. Perform 25% water changes weekly to maintain optimal water quality.",
  breeding:
    "Breeding bettas requires preparation and dedication. Males build bubble nests at the water surface where eggs are deposited. The male guards the nest and eggs, returning any fallen eggs to the bubbles. Fry hatch in 24-48 hours and become free-swimming in 3-4 days. Breeding pairs should be conditioned with high-protein foods for 1-2 weeks before spawning. After spawning, remove the female immediately as the male may become aggressive.",
  compatibility:
    "Male bettas should never be housed with other male bettas. They can be kept with peaceful community fish like Corydoras catfish, small tetras (ember, neon), and snails. Avoid fin-nipping species like tiger barbs or fast-moving fish that may stress the betta. Female bettas can sometimes be kept in groups called 'sororities' but this requires careful monitoring and a larger tank with many hiding spots.",
};

const ViewFish = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // In real app, fetch fish data based on id
  const fish = mockFishData;

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
      <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );

  const Section = ({
    icon: Icon,
    title,
    content,
  }: {
    icon: any;
    title: string;
    content: string;
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{content}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Fish className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {fish.commonName}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground italic">
            {fish.scientificName}
          </p>
          <Badge variant="secondary" className="mt-2">
            {fish.careLevel} Care
          </Badge>
        </div>

        {/* Basic Info Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoItem
                icon={Fish}
                label="Scientific Name"
                value={fish.scientificName}
              />
              <InfoItem icon={Users} label="Family" value={fish.family} />
              <InfoItem icon={MapPin} label="Origin" value={fish.origin} />
              <InfoItem
                icon={Droplets}
                label="Water Type"
                value={fish.waterType}
              />
              <InfoItem icon={Ruler} label="Size" value={fish.size} />
              <InfoItem
                icon={Thermometer}
                label="Temperature"
                value={fish.temperature}
              />
              <InfoItem icon={Droplets} label="pH Level" value={fish.pH} />
              <InfoItem
                icon={Droplets}
                label="Hardness"
                value={fish.hardness}
              />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section icon={Eye} title="Overview" content={fish.overview} />
          <Section
            icon={Fish}
            title="Physical Characteristics"
            content={fish.physicalCharacteristics}
          />
          <Section
            icon={Leaf}
            title="Habitat Requirements"
            content={fish.habitatRequirements}
          />
          <Section
            icon={Utensils}
            title="Care and Feeding"
            content={fish.careAndFeeding}
          />
          <Section icon={Heart} title="Breeding" content={fish.breeding} />
          <Section
            icon={Users}
            title="Compatibility"
            content={fish.compatibility}
          />
        </div>

        {/* Back to Home Button */}
        <div className="mt-8 flex justify-center">
          <Button onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewFish;
