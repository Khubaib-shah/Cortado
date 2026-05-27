interface StatCardProps {
  value: string | number;
  label: string;
  description: string;
  accentClass: string;
  icon: React.ReactNode;
}

export default function StatCard({ value, label, description, accentClass, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-surface flex items-start justify-between">
      <div>
        <span className="font-sans text-[10px] tracking-[2px] uppercase text-charcoal/50 font-semibold block mb-2">
          {label}
        </span>
        <div className="font-serif text-[32px] md:text-[38px] leading-none text-charcoal font-semibold">
          {value}
        </div>
        <span className="font-sans text-[11px] text-charcoal/40 font-light mt-1.5 block">
          {description}
        </span>
      </div>
      <div className={`w-11 h-11 rounded-full flex items-center justify-center ${accentClass}`}>
        {icon}
      </div>
    </div>
  );
}
