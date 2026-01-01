export type FilterType = "none" | "vintage" | "blackwhite" | "blue" | "grains" | "peachy";

interface CameraFiltersProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filters: { id: FilterType; name: string; preview: string }[] = [
  { id: "none", name: "Normal", preview: "◯" },
  { id: "vintage", name: "Vintage", preview: "📷" },
  { id: "blackwhite", name: "B&W", preview: "⚫" },
  { id: "blue", name: "Blue Light", preview: "💙" },
  { id: "grains", name: "Grains", preview: "✨" },
  { id: "peachy", name: "Peachy", preview: "🎨" },
];

const CameraFilters = ({ selectedFilter, onFilterChange }: CameraFiltersProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`flex flex-col items-center justify-center gap-1.5 rounded-lg transition-all flex-shrink-0 w-16 h-16 ${
            selectedFilter === filter.id
              ? "bg-primary text-primary-foreground scale-105"
              : "bg-card/50 text-muted-foreground hover:bg-card hover:scale-105"
          }`}
        >
          <span className="text-xl">{filter.preview}</span>
          <span className="text-xs font-medium whitespace-nowrap">{filter.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CameraFilters;

// Filter application functions
export const applyFilter = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  filter: FilterType
) => {
  if (filter === "none") return;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  switch (filter) {
    case "vintage":
      applyVintageFilter(data);
      break;
    case "blackwhite":
      applyBlackWhiteFilter(data);
      break;
    case "blue":
      applyDreamyFilter(data, canvas.width, canvas.height);
      break;
    case "grains":
      applyGrainsFilter(data);
      break;
    case "peachy":
      applyCartoonFilter(data, canvas.width, canvas.height);
      break;
    default:
      // No filter applied
      return;
  }

  ctx.putImageData(imageData, 0, 0);
};

const applyVintageFilter = (data: Uint8ClampedArray) => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Vintage effect: warm tones, slight desaturation
    data[i] = Math.min(255, r * 1.1 + 20); // Red boost
    data[i + 1] = Math.min(255, g * 0.95 + 10); // Slight green reduction
    data[i + 2] = Math.min(255, b * 0.9); // Blue reduction
  }
};

const applyBlackWhiteFilter = (data: Uint8ClampedArray) => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert to grayscale using luminance formula
    const gray = r * 0.299 + g * 0.587 + b * 0.114;
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
};

const applyDreamyFilter = (data: Uint8ClampedArray, width: number, height: number) => {
  // Create a copy for light leak calculations
  const originalData = new Uint8ClampedArray(data);
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    
    let r = originalData[i];
    let g = originalData[i + 1];
    let b = originalData[i + 2];

    // Add blue tones - increase blue, reduce warm colors
    r = Math.max(0, Math.min(255, r * 0.85)); // Reduce red
    g = Math.max(0, Math.min(255, g * 0.92)); // Slight green reduction
    b = Math.max(0, Math.min(255, b * 1.15 + 15)); // Boost blue

    // Soften the image slightly for dreamy effect
    const avg = (r + g + b) / 3;
    r = r * 0.85 + avg * 0.15;
    g = g * 0.85 + avg * 0.15;
    b = b * 0.85 + avg * 0.15;

    // Add light leaks - bright spots in corners and edges
    const centerX = width / 2;
    const centerY = height / 2;
    const distFromCenter = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
    const normalizedDist = distFromCenter / maxDist;

    // Light leak from top-left corner
    const topLeftDist = Math.sqrt(x * x + y * y);
    const topLeftMax = Math.sqrt(width * width + height * height);
    const topLeftFactor = 1 - (topLeftDist / topLeftMax) * 0.6;
    const topLeftLeak = Math.max(0, topLeftFactor) * 0.3;

    // Light leak from top-right corner
    const topRightDist = Math.sqrt((width - x) * (width - x) + y * y);
    const topRightMax = Math.sqrt(width * width + height * height);
    const topRightFactor = 1 - (topRightDist / topRightMax) * 0.5;
    const topRightLeak = Math.max(0, topRightFactor) * 0.25;

    // Light leak from bottom-right (blue tinted)
    const bottomRightDist = Math.sqrt(
      (width - x) * (width - x) + (height - y) * (height - y)
    );
    const bottomRightMax = Math.sqrt(width * width + height * height);
    const bottomRightFactor = 1 - (bottomRightDist / bottomRightMax) * 0.7;
    const bottomRightLeak = Math.max(0, bottomRightFactor) * 0.2;

    // Combine light leaks with blue tint
    const totalLeak = (topLeftLeak + topRightLeak + bottomRightLeak) * 0.8;
    const leakBlue = totalLeak * 255 * 0.4; // Blue-tinted light leak
    const leakBrightness = totalLeak * 255 * 0.3;

    // Apply light leaks
    r = Math.min(255, r + leakBrightness * 0.5);
    g = Math.min(255, g + leakBrightness * 0.6);
    b = Math.min(255, b + leakBlue + leakBrightness * 0.4);

    // Add subtle glow effect (slight brightness boost in center areas)
    const centerFactor = 1 - normalizedDist * 0.3;
    const glow = Math.max(0, centerFactor) * 0.1;
    r = Math.min(255, r + glow * 255);
    g = Math.min(255, g + glow * 255);
    b = Math.min(255, b + glow * 255 * 1.2); // More blue in glow

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
};

const applyGrainsFilter = (data: Uint8ClampedArray) => {
  for (let i = 0; i < data.length; i += 4) {
    // Add random noise
    const noise = (Math.random() - 0.5) * 30;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
};

const applyCartoonFilter = (data: Uint8ClampedArray, width: number, height: number) => {
  // Increase saturation and contrast for cartoon effect
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Boost saturation
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const saturation = max === 0 ? 0 : delta / max;

    if (saturation < 0.5) {
      // Increase saturation
      const factor = 1.5;
      const gray = (r + g + b) / 3;
      data[i] = Math.min(255, gray + (r - gray) * factor);
      data[i + 1] = Math.min(255, gray + (g - gray) * factor);
      data[i + 2] = Math.min(255, gray + (b - gray) * factor);
    }

    // Increase contrast
    data[i] = Math.max(0, Math.min(255, (data[i] - 128) * 1.3 + 128));
    data[i + 1] = Math.max(0, Math.min(255, (data[i + 1] - 128) * 1.3 + 128));
    data[i + 2] = Math.max(0, Math.min(255, (data[i + 2] - 128) * 1.3 + 128));
  }

  // Simple edge detection for cartoon effect (simplified)
  // This is a basic implementation - could be enhanced with proper edge detection
};

// Export a wrapper that includes width/height for cartoon filter
export const applyFilterWithDimensions = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  filter: FilterType
) => {
  applyFilter(ctx, canvas, filter);
};

