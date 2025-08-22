import { Sparkles } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex justify-center items-center gap-3">
      <div className="w-8 h-8 bg-linear-to-b from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
        <Sparkles size={20} className={"text-brand-200"} fill={"currentColor"} />
      </div>
      <span className="font-serif text-2xl font-medium text-white">Splitlet</span>
    </div>
  );
};
