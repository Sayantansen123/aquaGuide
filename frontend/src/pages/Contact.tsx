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
import { Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const [subject, setSubject] = useState<string>("");
  const [customSubject, setCustomSubject] = useState<string>("");

  const finalSubject = customSubject || subject;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Have questions? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
              <CardTitle>Email</CardTitle>
              <CardDescription>support@aquaguide.com</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Phone className="h-10 w-10 text-primary mx-auto mb-3" />
              <CardTitle>Phone</CardTitle>
              <CardDescription>+1 (555) 123-4567</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MessageSquare className="h-10 w-10 text-primary mx-auto mb-3" />
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Available 24/7</CardDescription>
            </CardHeader>
          </Card>
        </div>

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
                <Input id="subject" placeholder="What's this about?" required />
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
