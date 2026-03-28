interface PlaceholderProps {
  label: string;
  className?: string;
}

export default function Placeholder({ label, className = '' }: PlaceholderProps) {
  return (
    <div
      className={`bg-neutral-300 flex items-center justify-center text-black text-base ${className}`}
    >
      {label}
    </div>
  );
}
