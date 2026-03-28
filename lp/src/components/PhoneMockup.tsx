interface PhoneMockupProps {
  rotation?: number;
}

export default function PhoneMockup({ rotation = 0 }: PhoneMockupProps) {
  return (
    <div style={{ transform: `rotate(${rotation}deg)` }}>
      {/* aspect-[152/316] で元の比率を維持、w-full で親幅に追従 */}
      <div className="relative w-full aspect-[152/316] shadow-lg">
        {/* Device frame */}
        <div className="absolute inset-0 rounded-[14%/6.6%] border-[5px] border-neutral-100" />
        {/* Screen */}
        <div className="absolute inset-[5px] rounded-[10%/5%] bg-white" />
        {/* Inner shadow */}
        <div className="absolute inset-0 rounded-[14%/6.6%] pointer-events-none shadow-[inset_-1px_-3px_2px_0px_rgba(0,0,0,0.19)]" />
      </div>
    </div>
  );
}
