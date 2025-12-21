import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { textApi } from "@/api/modules/text";
import { toast } from "sonner";
import DOMPurify from "dompurify";

// Mock data - in a real app, this would come from an API
const mockGuidesData: Record<string, { title: string; content: string }> = {
  "1": {
    title: "Beginner's Guide to Freshwater Tanks",
    content: `Starting your first freshwater aquarium is an exciting journey into the world of fishkeeping. This guide will walk you through the essential steps to create a thriving aquatic environment.

**Choosing Your Tank**
For beginners, a 20-30 gallon tank is ideal. Larger tanks are actually easier to maintain because water parameters remain more stable. Avoid small bowls or tanks under 10 gallons as they require more frequent maintenance.

**Essential Equipment**
- Filter: Choose a filter rated for your tank size or slightly larger
- Heater: Most tropical fish need water between 75-80°F (24-27°C)
- Thermometer: To monitor water temperature
- Lighting: LED lights are energy-efficient and promote plant growth
- Substrate: Gravel or sand depending on your fish and plant choices

**The Nitrogen Cycle**
Before adding fish, you must cycle your tank. This process establishes beneficial bacteria that convert toxic ammonia into less harmful nitrates. This typically takes 4-6 weeks.

**Choosing Your First Fish**
Start with hardy species like guppies, platies, or corydoras catfish. Add fish slowly - no more than a few at a time - to avoid overwhelming your filter's bacterial colony.

**Maintenance Schedule**
- Daily: Check temperature, observe fish behavior
- Weekly: Test water parameters, clean algae
- Bi-weekly: 25% water change
- Monthly: Clean filter media (never in tap water)

With patience and consistent care, your freshwater tank will become a beautiful, living ecosystem.`,
  },
  "2": {
    title: "Saltwater Aquarium Setup",
    content: `Saltwater aquariums offer stunning marine life but require more expertise and investment than freshwater setups. Here's what you need to know.

**Types of Saltwater Tanks**
1. Fish-Only (FO): Simplest marine setup
2. Fish-Only with Live Rock (FOWLR): Adds natural filtration
3. Reef Tank: Most complex, includes corals and invertebrates

**Equipment Requirements**
- Protein skimmer: Essential for removing organic waste
- Powerheads: Create water movement similar to ocean currents
- Refractometer: Measures salinity precisely
- RO/DI water system: Removes impurities from tap water
- Quality salt mix: Marine salt formulated for aquarium use

**Water Parameters**
- Salinity: 1.024-1.026 specific gravity
- Temperature: 76-82°F (24-28°C)
- pH: 8.1-8.4
- Ammonia/Nitrite: 0 ppm
- Nitrate: <20 ppm (lower for reef tanks)

**Cycling a Saltwater Tank**
Similar to freshwater but typically takes 6-8 weeks. Live rock accelerates this process and provides natural biological filtration.

**Choosing Marine Fish**
Start with hardy species like clownfish, damselfish, or royal grammas. Research compatibility carefully as marine fish can be territorial.`,
  },
  "3": {
    title: "Fish Feeding Best Practices",
    content: `Proper nutrition is fundamental to fish health. Learn how to feed your fish correctly for optimal health and longevity.

**General Feeding Rules**
- Feed small amounts 1-2 times daily
- Only offer what fish can consume in 2-3 minutes
- Remove uneaten food to prevent water quality issues
- Fast your fish one day per week to aid digestion

**Types of Fish Food**
1. Flakes: Suitable for surface and mid-water feeders
2. Pellets: Available in floating and sinking varieties
3. Frozen foods: Bloodworms, brine shrimp, mysis shrimp
4. Live foods: Highest nutrition but risk of parasites
5. Vegetables: Blanched zucchini, peas for herbivores

**Species-Specific Needs**
- Carnivores: Protein-rich foods, meaty preparations
- Herbivores: Algae wafers, spirulina, vegetables
- Omnivores: Varied diet combining both types

**Vacation Feeding**
- Short trips (2-3 days): Fish can safely fast
- Longer absences: Use automatic feeders or feeding blocks
- Never overfeed before leaving

**Signs of Proper Nutrition**
- Vibrant coloration
- Active behavior
- Healthy growth rate
- Strong immune response`,
  },
  "4": {
    title: "Tank Cycling 101",
    content: `The nitrogen cycle is the most important concept in fishkeeping. Understanding it is essential for keeping healthy fish.

**What is the Nitrogen Cycle?**
Fish produce ammonia through waste and respiration. In nature, beneficial bacteria convert this toxic compound into less harmful substances. We need to establish these bacteria in our aquariums.

**The Process**
1. Ammonia (NH3) - Toxic, produced by fish waste
2. Nitrite (NO2) - Also toxic, produced by Nitrosomonas bacteria
3. Nitrate (NO3) - Less toxic, produced by Nitrobacter bacteria
4. Removed through water changes and plant absorption

**How to Cycle Your Tank**
**Fishless Cycling (Recommended)**
- Add ammonia source (pure ammonia or fish food)
- Maintain 2-4 ppm ammonia
- Test water daily
- Cycle complete when ammonia and nitrite reach 0 within 24 hours

**Fish-In Cycling (Not Recommended)**
- Stressful and potentially fatal for fish
- Requires daily water changes
- Only use extremely hardy species

**Timeline**
- Week 1-2: Ammonia rises
- Week 2-4: Nitrite spike, ammonia drops
- Week 4-6: Nitrite drops, nitrate appears
- Week 6+: Cycle complete

**Tips for Success**
- Never clean filter media in tap water (chlorine kills bacteria)
- Add bacteria supplements to speed up process
- Be patient - rushing leads to fish loss
- Test water regularly with a quality test kit`,
  },
};

const ViewTextGuide = () => {
  const { textId } = useParams<{ textId: string }>();
  const navigate = useNavigate();
  const { textIds } = useParams();
  const [guideTitle, setGuideTitle] = useState("");
  const [guideContent, setGuideContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const getText = async () => {
      try {
        const res = await textApi.getTextGuideByid(textIds);
        setGuideTitle(res.data.title);
        setGuideContent(DOMPurify.sanitize(res.data.content));
      } catch (error) {
        toast.error("Failed to fetch text guide");
      } finally {
        setIsLoading(false);
      }
    };

    getText();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Loading Guide...
          </h1>
        </div>
      </div>
    );
  }

  if (
    !guideTitle ||
    !guideContent ||
    guideTitle.toString().length === 0 ||
    guideContent.toString().length === 0
  ) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Guide Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The guide you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/")} variant="ocean">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        onClick={() => navigate("/")}
        variant="ghost"
        className="mb-6 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-6">
          {guideTitle}
        </h1>

        <div
          className="text-foreground/90 whitespace-pre-line leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(guideContent),
          }}
        ></div>
      </article>
    </div>
  );
};

export default ViewTextGuide;
