import {
  faHome,
  faBookOpen,
  faVideo,
  faFish,
  faUsers,
  faComments,
  faQuestionCircle,
  faEnvelope,
  faInfoCircle,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type NavItem = {
  name: string;
  path: string;
  icon?: IconDefinition;
  children?: NavItem[];
  description?: string;
};

export const navItems: NavItem[] = [
  {
    name: "Home",
    path: "/",
    icon: faHome,
  },
  {
    name: "Guides",
    path: "/guides",
    icon: faBookOpen,
    children: [
      {
        name: "Video Guides",
        path: "/video-guides",
        icon: faVideo,
        description: "Watch step-by-step tutorials",
      },
      {
        name: "Text Guides",
        path: "/text-guides",
        icon: faBook,
        description: "Read detailed articles",
      },
    ],
  },
  {
    name: "Resources",
    path: "/resources",
    icon: faFish,
    children: [
      {
        name: "Species Dictionary",
        path: "/species-dictionary",
        icon: faFish,
        description: "Explore fish species",
      },
      {
        name: "FAQ",
        path: "/faq",
        icon: faQuestionCircle,
        description: "Common questions answered",
      },
    ],
  },
  {
    name: "Community",
    path: "/community",
    icon: faUsers,
    children: [
      {
        name: "Forum",
        path: "/community-forum",
        icon: faUsers,
        description: "Join discussions",
      },
      {
        name: "Chat",
        path: "/community-chat",
        icon: faComments,
        description: "Real-time chat",
      },
    ],
  },
  {
    name: "About",
    path: "/about",
    icon: faInfoCircle,
    children: [
      {
        name: "About Us",
        path: "/about",
        icon: faInfoCircle,
        description: "Our story and mission",
      },
      {
        name: "Contact",
        path: "/contact",
        icon: faEnvelope,
        description: "Get in touch",
      },
    ],
  },
];
