import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils } from "lucide-react";
import Link from "next/link";

export function LihatMenuButton() {
  return (
    <Link href="/menu" className="inline-block">
      <Button 
        variant="secondary" 
        size="lg"
        className="group relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-200 hover:border-emerald-300 text-emerald-700 hover:text-emerald-800 font-semibold px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
            <Utensils className="w-5 h-5" />
          </div>
          <span className="text-lg">Lihat Menu</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/50 to-teal-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      </Button>
    </Link>
  );
}