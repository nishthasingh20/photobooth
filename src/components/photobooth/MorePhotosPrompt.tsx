import { Button } from "@/components/ui/button";
import { Camera, ArrowRight } from "lucide-react";

interface MorePhotosPromptProps {
  onContinue: () => void;
  onProceed: () => void;
}

const MorePhotosPrompt = ({ onContinue, onProceed }: MorePhotosPromptProps) => {
  return (
    <div className="animate-fade-in mt-4 rounded-xl bg-golden/30 p-4 text-center">
      <p className="mb-3 text-sm font-medium text-foreground">
        Do you want to click more photos?
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={onContinue}
          className="gap-2 rounded-lg"
        >
          <Camera className="h-3.5 w-3.5" />
          Continue
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onProceed}
          className="gap-2 rounded-lg bg-peach text-foreground hover:bg-peach/90"
        >
          Proceed
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default MorePhotosPrompt;
