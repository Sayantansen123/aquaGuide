import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How do I get started with fishkeeping?",
    answer: "Start by researching the nitrogen cycle and choosing appropriate beginner fish like guppies or tetras. Set up your tank at least 2 weeks before adding fish to allow beneficial bacteria to establish. Check out our beginner's guide for detailed steps."
  },
  {
    question: "How often should I change the water in my aquarium?",
    answer: "Generally, perform 25-30% water changes weekly for most aquariums. However, this can vary based on tank size, stocking levels, and filtration. Always test your water parameters to determine the ideal schedule for your specific setup."
  },
  {
    question: "What fish can live together?",
    answer: "Compatibility depends on several factors including water parameters, temperament, size, and swimming levels. Use our Species Compatibility tool to check if specific fish are compatible. Generally, peaceful community fish like tetras, corydoras, and peaceful gouramis work well together."
  },
  {
    question: "How do I cycle a new aquarium?",
    answer: "Cycling takes 4-6 weeks. Add an ammonia source (fish food or pure ammonia), test water daily, and wait for ammonia and nitrite to drop to zero while nitrates rise. Don't add fish until the cycle completes. Our video guide explains this process in detail."
  },
  {
    question: "What size tank do I need?",
    answer: "Bigger is always better! Minimum recommendations: 10 gallons for small fish, 20 gallons for community tanks, 55+ gallons for larger fish. Larger tanks are more stable and easier to maintain. Consider adult fish size and swimming space needs."
  },
  {
    question: "How do I treat common fish diseases?",
    answer: "First, quarantine sick fish if possible. Common treatments include aquarium salt for minor infections, medications for ich or fungus, and improved water quality. Always identify the disease first - see our health guide or consult the forum for specific symptoms."
  },
  {
    question: "What equipment do I need?",
    answer: "Essential equipment includes: filter (rated for your tank size), heater (for tropical fish), lighting, thermometer, test kit, and substrate. Optional but helpful: air pump, decorations, plants, and a siphon for water changes."
  },
  {
    question: "Can I keep saltwater and freshwater fish together?",
    answer: "No, saltwater and freshwater fish have completely different requirements and cannot be mixed. Some brackish water species can tolerate varied salinity, but pure freshwater and saltwater fish must be kept separately."
  },
  {
    question: "How much should I feed my fish?",
    answer: "Feed small amounts 1-2 times daily, only what fish can consume in 2-3 minutes. Overfeeding is a common mistake that leads to water quality issues. Use our Feeding Schedule tool to create a customized plan for your species."
  },
  {
    question: "Why is my water cloudy?",
    answer: "Cloudy water can be caused by bacterial bloom (white cloudiness in new tanks), algae bloom (green water), or stirred substrate. Bacterial blooms resolve naturally in 1-2 weeks. Green water needs light reduction and water changes. Test your water parameters."
  }
];

const FAQ = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Find answers to common questions about fishkeeping and our platform
          </p>
        </div>

        <Card className="p-4 sm:p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-sm sm:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <div className="mt-8 md:mt-12 text-center p-6 sm:p-8 glass-effect rounded-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">
            Can't find what you're looking for? Our community is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/community-forum" className="w-full sm:w-auto">
              <Button variant="ocean" className="w-full sm:w-auto">Ask the Community</Button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
