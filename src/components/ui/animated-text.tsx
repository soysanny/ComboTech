"use client";

export interface AnimatedTextProps {
  text: string;
  className?: string;
  /** Delay between each word, in ms. */
  stagger?: number;
}

/**
 * Splits text into words and animates each in with a staggered rise.
 * Give it a `key` tied to the text to replay the animation on change.
 */
export function AnimatedText({
  text,
  className,
  stagger = 70,
}: AnimatedTextProps) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="animate-slide-up inline-block motion-reduce:animate-none"
          style={{ animationDelay: `${index * stagger}ms` }}
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}
