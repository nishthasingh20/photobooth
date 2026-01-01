import { useRef, useState, useCallback } from "react";
import { Download, Share2, Trash2, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { templates } from "./StripPicker";
import { toast } from "@/hooks/use-toast";
import StickerPicker, { Sticker } from "./StickerPicker";
import TextPicker, { TextElement } from "./TextPicker";

interface FinalStripProps {
  photos: string[];
  templateId: string;
}

const FinalStrip = ({ photos, templateId }: FinalStripProps) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const template = templates.find((t) => t.id === templateId) || templates[0];
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [texts, setTexts] = useState<TextElement[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragType, setDragType] = useState<"sticker" | "text" | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [stickerPickerExpanded, setStickerPickerExpanded] = useState(false);

  const handleAddSticker = (emoji: string) => {
    const newSticker: Sticker = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      x: 20 + Math.random() * 60,
      y: 10 + Math.random() * 80,
      size: 28 + Math.random() * 12,
      rotation: -15 + Math.random() * 30,
    };
    setStickers([...stickers, newSticker]);
  };

  const handleRemoveSticker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStickers(stickers.filter((s) => s.id !== id));
  };

  const handleAddText = (text: string, color: string, fontFamily: string) => {
    const newText: TextElement = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      x: 20 + Math.random() * 60,
      y: 10 + Math.random() * 80,
      fontSize: 16 + Math.random() * 8,
      color,
      fontFamily,
      rotation: -5 + Math.random() * 10,
    };
    setTexts([...texts, newText]);
  };

  const handleUpdateText = (id: string, updates: Partial<TextElement>) => {
    setTexts(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const handleRemoveText = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTexts(texts.filter((t) => t.id !== id));
  };

  const handleMouseDown = (e: React.MouseEvent, sticker: Sticker) => {
    if (!stripRef.current) return;
    e.preventDefault();
    
    const rect = stripRef.current.getBoundingClientRect();
    const currentX = (sticker.x / 100) * rect.width;
    const currentY = (sticker.y / 100) * rect.height;
    
    setDragOffset({
      x: e.clientX - rect.left - currentX,
      y: e.clientY - rect.top - currentY,
    });
    setDraggingId(sticker.id);
    setDragType("sticker");
  };

  const handleTextMouseDown = (e: React.MouseEvent, text: TextElement) => {
    if (!stripRef.current) return;
    e.preventDefault();
    
    const rect = stripRef.current.getBoundingClientRect();
    const currentX = (text.x / 100) * rect.width;
    const currentY = (text.y / 100) * rect.height;
    
    setDragOffset({
      x: e.clientX - rect.left - currentX,
      y: e.clientY - rect.top - currentY,
    });
    setDraggingId(text.id);
    setDragType("text");
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggingId || !stripRef.current || !dragType) return;
    
    const rect = stripRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;
    
    // Clamp values to keep within bounds
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(2, Math.min(98, y));
    
    if (dragType === "sticker") {
      setStickers(prev => prev.map(s => 
        s.id === draggingId ? { ...s, x: clampedX, y: clampedY } : s
      ));
    } else if (dragType === "text") {
      setTexts(prev => prev.map(t => 
        t.id === draggingId ? { ...t, x: clampedX, y: clampedY } : t
      ));
    }
  }, [draggingId, dragOffset, dragType]);

  const handleMouseUp = () => {
    setDraggingId(null);
    setDragType(null);
  };

  const handleTouchStart = (e: React.TouchEvent, sticker: Sticker) => {
    if (!stripRef.current) return;
    
    const touch = e.touches[0];
    const rect = stripRef.current.getBoundingClientRect();
    const currentX = (sticker.x / 100) * rect.width;
    const currentY = (sticker.y / 100) * rect.height;
    
    setDragOffset({
      x: touch.clientX - rect.left - currentX,
      y: touch.clientY - rect.top - currentY,
    });
    setDraggingId(sticker.id);
    setDragType("sticker");
  };

  const handleTextTouchStart = (e: React.TouchEvent, text: TextElement) => {
    if (!stripRef.current) return;
    
    const touch = e.touches[0];
    const rect = stripRef.current.getBoundingClientRect();
    const currentX = (text.x / 100) * rect.width;
    const currentY = (text.y / 100) * rect.height;
    
    setDragOffset({
      x: touch.clientX - rect.left - currentX,
      y: touch.clientY - rect.top - currentY,
    });
    setDraggingId(text.id);
    setDragType("text");
  };

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!draggingId || !stripRef.current || !dragType) return;
    
    const touch = e.touches[0];
    const rect = stripRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const y = ((touch.clientY - rect.top - dragOffset.y) / rect.height) * 100;
    
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(2, Math.min(98, y));
    
    if (dragType === "sticker") {
      setStickers(prev => prev.map(s => 
        s.id === draggingId ? { ...s, x: clampedX, y: clampedY } : s
      ));
    } else if (dragType === "text") {
      setTexts(prev => prev.map(t => 
        t.id === draggingId ? { ...t, x: clampedX, y: clampedY } : t
      ));
    }
  }, [draggingId, dragOffset, dragType]);

  const handleDownload = async () => {
    if (!stripRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(stripRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const link = document.createElement("a");
      link.download = `photobooth-strip-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "Downloaded!",
        description: "Your photo strip has been saved.",
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Download failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Photo Strip",
          text: "Check out my photo booth strip!",
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 lg:gap-16 lg:flex-row lg:items-start lg:justify-center">
      <div className="relative">
        <div
          ref={stripRef}
          className={`${template.bgColor} relative flex w-64 flex-col gap-3 rounded-2xl p-4 shadow-soft select-none`}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {photos.slice(0, 4).map((photo, index) => (
            <div
              key={index}
              className={`overflow-hidden rounded-lg border-2 ${template.frameColor}`}
            >
              <img
                src={photo}
                alt={`Strip photo ${index + 1}`}
                className="w-full pointer-events-none"
                style={{ display: "block" }}
                draggable={false}
              />
            </div>
          ))}
          <div className="mt-2 text-center">
            <p className="font-display text-sm font-semibold text-foreground/70">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Stickers overlay */}
          {stickers.map((sticker) => (
            <div
              key={sticker.id}
              className={`absolute group ${draggingId === sticker.id && dragType === "sticker" ? 'cursor-grabbing z-20' : 'cursor-grab z-10'}`}
              style={{
                left: `${sticker.x}%`,
                top: `${sticker.y}%`,
                fontSize: `${sticker.size}px`,
                transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
              }}
              onMouseDown={(e) => handleMouseDown(e, sticker)}
              onTouchStart={(e) => handleTouchStart(e, sticker)}
            >
              <span 
                className={`select-none drop-shadow-md transition-transform ${
                  draggingId === sticker.id && dragType === "sticker" ? 'scale-125' : 'group-hover:scale-110'
                }`}
              >
                {sticker.emoji}
              </span>
              <button
                onClick={(e) => handleRemoveSticker(sticker.id, e)}
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-full p-0.5 hover:scale-110"
              >
                <Trash2 className="h-3 w-3" />
              </button>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-60 transition-opacity">
                <Move className="h-3 w-3 text-foreground/50" />
              </div>
            </div>
          ))}

          {/* Text overlay */}
          {texts.map((text) => (
            <div
              key={text.id}
              className={`absolute group ${draggingId === text.id && dragType === "text" ? 'cursor-grabbing z-20' : 'cursor-grab z-10'}`}
              style={{
                left: `${text.x}%`,
                top: `${text.y}%`,
                fontSize: `${text.fontSize}px`,
                color: text.color,
                fontFamily: text.fontFamily,
                transform: `translate(-50%, -50%) rotate(${text.rotation}deg)`,
              }}
              onMouseDown={(e) => handleTextMouseDown(e, text)}
              onTouchStart={(e) => handleTextTouchStart(e, text)}
            >
              <span 
                className={`select-none drop-shadow-md transition-transform whitespace-nowrap ${
                  draggingId === text.id && dragType === "text" ? 'scale-110' : 'group-hover:scale-105'
                }`}
              >
                {text.text}
              </span>
              <button
                onClick={(e) => handleRemoveText(text.id, e)}
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-full p-0.5 hover:scale-110"
              >
                <Trash2 className="h-3 w-3" />
              </button>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-60 transition-opacity">
                <Move className="h-3 w-3 text-foreground/50" />
              </div>
            </div>
          ))}
        </div>
        
        {(stickers.length > 0 || texts.length > 0) && (
          <p className="mt-2 text-xs text-center text-muted-foreground">
            Drag stickers and text to move • Hover & click ✕ to remove
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[200px]">
        <Button
          variant="default"
          size="lg"
          onClick={handleDownload}
          className="gap-2 rounded-xl bg-primary px-8 w-full lg:w-auto"
        >
          <Download className="h-4 w-4" />
          Download Image
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={handleShare}
          className="gap-2 rounded-xl px-8 w-full lg:w-auto"
        >
          <Share2 className="h-4 w-4" />
          Share Link
        </Button>
        
        <div className="w-full lg:w-auto">
          <StickerPicker 
            onAddSticker={handleAddSticker} 
            selectedStickers={stickers}
            onExpandedChange={setStickerPickerExpanded}
          />
        </div>
        
        <div className="w-full lg:w-auto">
          <TextPicker 
            onAddText={handleAddText} 
            selectedTexts={texts}
            onUpdateText={handleUpdateText}
            stickerPickerExpanded={stickerPickerExpanded}
          />
        </div>
        
        {(stickers.length > 0 || texts.length > 0) && (
          <div className="flex flex-col gap-2">
            {stickers.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStickers([])}
                className="gap-2 text-muted-foreground hover:text-destructive w-full lg:w-auto"
              >
                <Trash2 className="h-3 w-3" />
                Clear all stickers
              </Button>
            )}
            {texts.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTexts([])}
                className="gap-2 text-muted-foreground hover:text-destructive w-full lg:w-auto"
              >
                <Trash2 className="h-3 w-3" />
                Clear all text
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalStrip;
