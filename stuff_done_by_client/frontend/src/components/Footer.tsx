import { Link } from "react-router-dom";
import { Fish, BookOpen, MessageSquare, Users } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Fish className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-bold">Aqua Guide</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your comprehensive guide to thriving aquariums and fishkeeping community.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Knowledge
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/video-guides" className="text-muted-foreground hover:text-primary transition-colors">
                  Video Guides
                </Link>
              </li>
              <li>
                <Link to="/text-guides" className="text-muted-foreground hover:text-primary transition-colors">
                  Text Guides
                </Link>
              </li>
              <li>
                <Link to="/species-dictionary" className="text-muted-foreground hover:text-primary transition-colors">
                  Species Dictionary
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Community
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/community-forum" className="text-muted-foreground hover:text-primary transition-colors">
                  Community Forum
                </Link>
              </li>
              <li>
                <Link to="/community-chat" className="text-muted-foreground hover:text-primary transition-colors">
                  Community Chat
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Aqua Guide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
