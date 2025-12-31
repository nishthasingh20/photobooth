import { Check } from "lucide-react";

interface StripTemplate {
  id: string;
  name: string;
  layout: "vertical" | "grid" | "horizontal";
  bgColor: string;
  frameColor: string;
}

const templates: StripTemplate[] = [
  { id: "classic", name: "Classic", layout: "vertical", bgColor: "bg-arctic", frameColor: "border-foreground/10" },
  { id: "rose", name: "Rose", layout: "vertical", bgColor: "bg-rose/30", frameColor: "border-rose" },
  { id: "golden", name: "Golden", layout: "vertical", bgColor: "bg-golden/40", frameColor: "border-golden" },
  { id: "olive", name: "Olive", layout: "vertical", bgColor: "bg-olive/20", frameColor: "border-olive" },
  { id: "peach", name: "Peach", layout: "vertical", bgColor: "bg-peach/30", frameColor: "border-peach" },
];

interface StripPickerProps {
  selectedTemplate: string | null;
  onSelectTemplate: (templateId: string) => void;
}

const StripPicker = ({ selectedTemplate, onSelectTemplate }: StripPickerProps) => {
  return (
    <div className="animate-slide-up text-center">
      <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
        Choose a Strip Template
      </h3>
      <div className="flex justify-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={`strip-template flex-shrink-0 ${
              selectedTemplate === template.id ? "selected" : ""
            }`}
          >
            <div className={`relative flex h-40 w-24 flex-col gap-1.5 ${template.bgColor} p-2`}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex-1 rounded border ${template.frameColor} bg-card/60`}
                />
              ))}
              {selectedTemplate === template.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                  <div className="rounded-full bg-primary p-1">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
            <div className="bg-card py-2 text-center">
              <span className="text-xs font-medium text-foreground">
                {template.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StripPicker;
export { templates };
export type { StripTemplate };
