import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoPreviewStackProps {
  photos: string[];
  onRetake?: (index: number) => void;
}

const PhotoPreviewStack = ({ photos, onRetake }: PhotoPreviewStackProps) => {
  if (photos.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-card/50 p-6">
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 w-20 rounded-lg bg-muted/30"
              style={{ opacity: 1 - i * 0.2 }}
            />
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Your photos will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 overflow-y-auto rounded-2xl bg-card/50 p-4">
      {photos.map((photo, index) => (
        <div
          key={index}
          className="photo-card animate-photo-in overflow-hidden max-w-[90%] mx-auto"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <img
            src={photo}
            alt={`Captured photo ${index + 1}`}
            className="w-full"
            style={{ display: "block" }}
          />
          <div className="bg-secondary/50 px-3 py-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Photo {index + 1}
            </span>
            {onRetake && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRetake(index)}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Retake
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoPreviewStack;
