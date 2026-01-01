import { useState } from "react";
import { Type, Palette } from "lucide-react";

export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  rotation: number;
}

const availableColors = [
  "#000000", "#FFFFFF", "#FF6B6B", "#4ECDC4", "#45B7D1",
  "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2",
  "#F8B739", "#E74C3C", "#3498DB", "#2ECC71", "#9B59B6",
];

const availableFonts = [
  { name: "DM Sans", value: "'DM Sans', sans-serif" },
  { name: "Playfair Display", value: "'Playfair Display', serif" },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Courier", value: "'Courier New', monospace" },
  { name: "Comic Sans", value: "'Comic Sans MS', cursive" },
];

interface TextPickerProps {
  onAddText: (text: string, color: string, fontFamily: string) => void;
  selectedTexts: TextElement[];
  onUpdateText: (id: string, updates: Partial<TextElement>) => void;
  stickerPickerExpanded?: boolean;
}

const TextPicker = ({ onAddText, selectedTexts, onUpdateText, stickerPickerExpanded = false }: TextPickerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);
  const [selectedFont, setSelectedFont] = useState(availableFonts[0].value);

  const handleAddText = () => {
    if (textInput.trim()) {
      onAddText(textInput.trim(), selectedColor, selectedFont);
      setTextInput("");
    }
  };

  return (
    <div className={stickerPickerExpanded ? "mt-6" : "mt-3"}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full justify-center lg:justify-start"
      >
        <Type className="h-4 w-4" />
        {isExpanded ? "Hide Text" : "Add Text"}
        <span className="text-xs text-muted-foreground">
          ({selectedTexts.length} added)
        </span>
      </button>

      <div className={`mt-3 transition-all duration-300 overflow-hidden ${
        isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="rounded-xl bg-card/50 p-3 border border-border/50 space-y-3">
          <p className="text-xs text-muted-foreground mb-2">
            Add custom text to your strip!
          </p>
          
          {/* Text Input */}
          <div className="space-y-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddText();
                }
              }}
              placeholder="Enter your text..."
              className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={handleAddText}
              disabled={!textInput.trim()}
              className="w-full px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Text
            </button>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Palette className="h-3 w-3" />
              <span>Color</span>
            </div>
            <div className="grid grid-cols-8 gap-1.5">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-8 w-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedColor === color ? "border-foreground scale-110" : "border-border/30"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Font Picker */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Font</div>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {availableFonts.map((font) => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          {/* Edit existing texts */}
          {selectedTexts.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border/30">
              <div className="text-xs text-muted-foreground">Edit Text</div>
              {selectedTexts.map((textEl) => (
                <div key={textEl.id} className="space-y-1.5 p-2 rounded-lg bg-background/30">
                  <input
                    type="text"
                    value={textEl.text}
                    onChange={(e) => onUpdateText(textEl.id, { text: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-background/50 border border-border/30 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="range"
                      min="12"
                      max="48"
                      value={textEl.fontSize}
                      onChange={(e) => onUpdateText(textEl.id, { fontSize: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-8">{textEl.fontSize}px</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {availableColors.slice(0, 6).map((color) => (
                      <button
                        key={color}
                        onClick={() => onUpdateText(textEl.id, { color })}
                        className={`h-6 w-6 rounded border ${
                          textEl.color === color ? "border-foreground scale-110" : "border-border/30"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextPicker;

