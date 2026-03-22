import { Book as BookIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BookDetailHeroProps {
  title: string;
  author: string;
  imageUrl?: string;
  status: string;
}

export const BookDetailHero = ({ title, author, imageUrl, status }: BookDetailHeroProps) => {
  const isAvailable = status === "AVAILABLE";

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 bg-white dark:bg-gray-800/40 backdrop-blur-md p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden relative">
      {/* Aesthetic background elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Image Column */}
      <div className="md:col-span-5 lg:col-span-4">
        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative group">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center text-gray-300 gap-4">
              <BookIcon className="w-20 h-20" />
              <span className="text-sm font-medium">No cover available</span>
            </div>
          )}
          <div className="absolute top-4 right-4">
             <Badge
               variant={isAvailable ? "secondary" : "default"}
               className={`font-bold tracking-widest uppercase px-3 py-1 shadow-lg ${
                 isAvailable
                   ? "bg-green-500 text-white border-none"
                   : status === "RESERVED"
                   ? "bg-amber-500 text-white border-none"
                   : "bg-red-500 text-white border-none"
               }`}
             >
               {status}
             </Badge>
          </div>
        </div>
      </div>

      {/* Content Column */}
      <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {title}
          </h1>
          <div className="flex items-center gap-2 text-xl font-medium text-primary">
            <span className="text-muted-foreground mr-2 text-sm uppercase tracking-widest font-bold">Author</span>
            <span>{author}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
