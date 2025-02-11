import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
  IconVideo,
  IconScreenShare,
  IconMessage,
  IconUsers,
  IconLock,
  IconDevices,
  IconWifi,
  IconHeadset,
} from "@tabler/icons-react";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "HD Video Calls",
      description:
        "Crystal clear video quality with support for multiple participants in HD resolution.",
      icon: <IconVideo />,
    },
    {
      title: "Screen Sharing",
      description:
        "Share your screen instantly with one click for seamless collaboration.",
      icon: <IconScreenShare />,
    },
    {
      title: "Real-time Chat",
      description:
        "Built-in chat functionality for instant messaging during meetings.",
      icon: <IconMessage />,
    },
    {
      title: "Group Meetings",
      description: "Host meetings with multiple participants with ease.",
      icon: <IconUsers />,
    },
    {
      title: "Secure Meetings",
      description:
        "End-to-end encryption ensures your conversations stay private.",
      icon: <IconLock />,
    },
    {
      title: "Cross-platform",
      description:
        "Join meetings from any device - desktop, tablet, or mobile.",
      icon: <IconDevices />,
    },
    {
      title: "Low Latency",
      description:
        "Optimized for minimal delay and smooth communication.",
      icon: <IconWifi />,
    },
    {
      title: "Audio Quality",
      description: "Crystal clear audio with noise cancellation technology.",
      icon: <IconHeadset />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature",
        "border-neutral-200 dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l",
        index < 4 && "lg:border-b"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-200 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-200 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-900 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-900 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
