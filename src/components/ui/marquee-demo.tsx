"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";

const reviews = [
  {
    name: "Anonymous",
    username: "@stagelearner",
    body: "After my first presentation, I got feedback that helped me speak with more confidence next time.",
    img: "https://avatar.vercel.sh/s1",
  },
  {
    name: "Anonymous",
    username: "@talkimprover",
    body: "The feedback I received after my self-introduction was so detailed — I never noticed those small habits before.",
    img: "https://avatar.vercel.sh/s2",
  },
  {
    name: "Anonymous",
    username: "@growthvoice",
    body: "People pointed out how my tone could be clearer. Simple tips, but they made my next talk way better.",
    img: "https://avatar.vercel.sh/s3",
  },
  {
    name: "Anonymous",
    username: "@presentbetter",
    body: "After my team event, I got notes about my body language — it really boosted my stage presence.",
    img: "https://avatar.vercel.sh/s4",
  },
  {
    name: "Anonymous",
    username: "@learner101",
    body: "I felt nervous sharing my speech, but the feedback here motivated me to try again — this time with confidence.",
    img: "https://avatar.vercel.sh/s5",
  },
  {
    name: "Anonymous",
    username: "@eventsharer",
    body: "It’s amazing how constructive the feedback was — not criticism, just pure improvement ideas.",
    img: "https://avatar.vercel.sh/s6",
  },
  {
    name: "Anonymous",
    username: "@growthpath",
    body: "Someone suggested I slow down a bit while speaking — that one tip made my delivery so much better.",
    img: "https://avatar.vercel.sh/s7",
  },
  {
    name: "Anonymous",
    username: "@inspiredvoice",
    body: "Hearing genuine appreciation for my effort kept me motivated to keep improving.",
    img: "https://avatar.vercel.sh/s8",
  },
  {
    name: "Anonymous",
    username: "@openmind",
    body: "The feedback I got after my session felt honest and kind — exactly what I needed to grow.",
    img: "https://avatar.vercel.sh/s9",
  },
  {
    name: "Anonymous",
    username: "@confidentnow",
    body: "This space made me realize feedback doesn’t hurt — it helps. I feel more confident every time I share.",
    img: "https://avatar.vercel.sh/s10",
  },
  {
    name: "Anonymous",
    username: "@voicebuilder",
    body: "Each feedback session feels like a step toward becoming my best version on stage.",
    img: "https://avatar.vercel.sh/s11",
  },
  {
    name: "Anonymous",
    username: "@nextlevel",
    body: "It’s not about being perfect — it’s about progress. And this platform makes that journey enjoyable.",
    img: "https://avatar.vercel.sh/s12",
  },
];



const firstRow = reviews.slice(0, 3);
const secondRow = reviews.slice(3);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-300",
        "bg-card border-border hover:bg-card/80 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]",
        "text-foreground"
      )}
    >
      <div className="flex items-center gap-3">
        <img className="rounded-full" width="36" height="36" alt={name} src={img} />
        <div>
          <figcaption className="text-sm font-medium">{name}</figcaption>
          <p className="text-xs text-muted-foreground">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm  text-white">“{body}”</blockquote>
    </figure>
  );
};


export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
      {/* Top Row: RIGHT → LEFT */}
      <Marquee pauseOnHover className="[--duration:25s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>

      {/* Bottom Row: LEFT → RIGHT */}
      <Marquee reverse pauseOnHover className="[--duration:25s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>

      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black"></div>
    </div>
  );
}
