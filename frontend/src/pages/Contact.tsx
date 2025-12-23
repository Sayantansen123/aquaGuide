import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bug, HelpCircle, Lightbulb, Mail, MessageSquare, Phone, Users } from "lucide-react";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Drop Us a Line
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you have a question about the site, a brilliant idea for a guide,
            or just want to share a fish tale, we're always here to listen. Your
            currents of thought help shape our community ocean.
          </p>
        </div>
       <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            How Can We Help?
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            For the fastest response to fishkeeping questions, we recommend
            posting on our{" "}
            <span className="text-primary underline cursor-pointer">
              Community Forum
            </span>
            .
          </p>
        </div> 

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      <Card>
        <CardContent className="p-6 text-center">
          <Lightbulb className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Suggest a Guide</h3>
              <p className="text-muted-foreground text-sm">
                 Have an idea for a video or an article? We’d love to hear it.
              </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <Bug className="h-10 w-10 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Spotted a Glitch?</h3>
              <p className="text-muted-foreground text-sm">
              Found a hitchhiker snail (a bug) on the site? Let us know!
              </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <Users className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Partnerships</h3>
              <p className="text-muted-foreground text-sm">
                Want to swim with our school? Let’s talk collaboration.
              </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <HelpCircle className="h-10 w-10 text-cyan-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Other Questions</h3>
              <p className="text-muted-foreground text-sm">
                For anything else that doesn’t fit the categories above.
              </p>
          </CardContent>
      </Card>
    </div>


        {/* EXISTING FORM */}
        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as
              possible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="What's this about?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us how we can help..."
                  className="min-h-[150px]"
                  required
                />
              </div>

              <Button type="submit" variant="ocean" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Contact;
