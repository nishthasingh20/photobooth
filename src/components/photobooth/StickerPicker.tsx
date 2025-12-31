import { useState } from "react";

export interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

const availableStickers = [
  "✨", "🌸", "💖", "🦋", "🌈", "⭐", "🎀", "🍀",
  "🌻", "🐝", "🌙", "💫", "🎉", "🥳", "😊", "🤍",
  "🌷", "🍃", "☁️", "🔮", "💐", "🧸", "🎈", "🌺",
];

interface StickerPickerProps {
  onAddSticker: (emoji: string) => void;
  selectedStickers: Sticker[];
}

const StickerPicker = ({ onAddSticker, selectedStickers }: StickerPickerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-4 min-h-[200px]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full justify-center lg:justify-start"
      >
        <span className="text-lg">🎨</span>
        {isExpanded ? "Hide Stickers" : "Add Stickers"}
        <span className="text-xs text-muted-foreground">
          ({selectedStickers.length} added)
        </span>
      </button>

      <div className={`mt-3 transition-all duration-300 overflow-hidden ${
        isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="animate-fade-in rounded-xl bg-card/50 p-3 border border-border/50">
          <p className="text-xs text-muted-foreground mb-2">
            Tap to add stickers to your strip!
          </p>
          <div className="grid grid-cols-8 gap-2">
            {availableStickers.map((emoji, index) => (
              <button
                key={index}
                onClick={() => onAddSticker(emoji)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/50 text-xl hover:bg-background hover:scale-110 transition-all duration-200 hover:shadow-soft"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickerPicker;
