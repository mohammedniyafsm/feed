import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

 const anonymousAvatars = [
  "https://github.com/shadcn.png",
  "https://github.com/evilrabbit.png",
  "https://github.com/maxleiter.png",
  "https://github.com/vercel.png",
  "https://avatars.githubusercontent.com/u/000?v=4",
  "https://avatars.githubusercontent.com/u/111?v=4",
  "https://avatars.githubusercontent.com/u/222?v=4",
];

export default function getRandomAvatar  ()  {
  const index = Math.floor(Math.random() * anonymousAvatars.length);
  return anonymousAvatars[index];
};
