import { useState } from "react";
import CameraSection from "@/components/photobooth/CameraSection";
import PhotoPreviewStack from "@/components/photobooth/PhotoPreviewStack";
import StripPicker from "@/components/photobooth/StripPicker";
import FinalStrip from "@/components/photobooth/FinalStrip";
import MorePhotosPrompt from "@/components/photobooth/MorePhotosPrompt";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

type AppState = "capturing" | "askMore" | "bonusCapture" | "selectTemplate" | "finalOutput";

const Index = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [appState, setAppState] = useState<AppState>("capturing");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleCapture = (imageData: string) => {
    const newPhotos = [...photos, imageData];
    setPhotos(newPhotos);

    if (appState === "bonusCapture") {
      setAppState("selectTemplate");
    } else if (newPhotos.length >= 3 && appState === "capturing") {
      setAppState("askMore");
    }
  };

  const handleContinue = () => {
    setAppState("bonusCapture");
  };

  const handleProceed = () => {
    setAppState("selectTemplate");
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setAppState("finalOutput");
  };

  const handleReset = () => {
    setPhotos([]);
    setAppState("capturing");
    setSelectedTemplate(null);
  };

  const canCapture =
    (appState === "capturing" && photos.length < 3) ||
    (appState === "bonusCapture" && photos.length < 4);

  return (
    <div className="min-h-screen bg-background px-6 py-8 lg:px-12">
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl font-bold text-foreground">
          Photobooth
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Capture moments, create memories
        </p>
      </header>

      {appState !== "finalOutput" ? (
        <>
          <main className="mx-auto max-w-5xl">
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              {/* Camera Section */}
              <div className="order-1">
                <CameraSection onCapture={handleCapture} canCapture={canCapture} />
              </div>

              {/* Photo Preview Stack */}
              <div className="order-2 min-h-[300px]">
                <PhotoPreviewStack photos={photos} />
                
                {appState === "askMore" && (
                  <MorePhotosPrompt
                    onContinue={handleContinue}
                    onProceed={handleProceed}
                  />
                )}

                {appState === "bonusCapture" && photos.length < 4 && (
                  <div className="animate-fade-in mt-4 rounded-xl bg-rose/20 p-3 text-center">
                    <p className="text-sm text-muted-foreground">
                      Capture your bonus photo!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Strip Template Picker */}
            {appState === "selectTemplate" && (
              <>
                <Separator className="my-8" />
                <StripPicker
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={handleSelectTemplate}
                />
              </>
            )}
          </main>
        </>
      ) : (
        <main className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Your Photo Strip
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Start Over
            </Button>
          </div>
          <FinalStrip photos={photos} templateId={selectedTemplate!} />
        </main>
      )}

      <footer className="mt-12 text-center">
        <p className="text-xs text-muted-foreground/60">
          Made with care • Portfolio Project
        </p>
      </footer>
    </div>
  );
};

export default Index;
