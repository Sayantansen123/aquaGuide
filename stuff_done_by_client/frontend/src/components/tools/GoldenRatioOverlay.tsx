import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Frame, Upload, Layers } from "lucide-react";

interface GoldenRatioOverlayProps {
  children: React.ReactNode;
}

export const GoldenRatioOverlay = ({ children }: GoldenRatioOverlayProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [overlayType, setOverlayType] = useState<"golden" | "thirds">("golden");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Frame className="h-5 w-5 text-primary" />
            Aquascape "Golden Ratio" Overlay
          </DialogTitle>
          <DialogDescription>
            Upload a photo of your tank to see focal points and composition guides.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex gap-2">
              <Button
                variant={overlayType === "golden" ? "ocean" : "outline"}
                onClick={() => setOverlayType("golden")}
                size="sm"
              >
                Golden Ratio (ϕ)
              </Button>
              <Button
                variant={overlayType === "thirds" ? "ocean" : "outline"}
                onClick={() => setOverlayType("thirds")}
                size="sm"
              >
                Rule of Thirds
              </Button>
            </div>
            <div>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Tank Photo
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="relative w-full aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden border">
              {image ? (
                <div className="relative w-full h-full">
                  <img src={image} alt="Aquascape" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 pointer-events-none">
                    {overlayType === "golden" && (
                      <>
                        <div className="absolute top-0 bottom-0 border-l-2 border-red-500/70 left-[38.2%]"></div>
                        <div className="absolute top-0 bottom-0 border-l-2 border-red-500/70 left-[61.8%]"></div>
                        <div className="absolute left-0 right-0 border-t-2 border-red-500/70 top-[38.2%]"></div>
                        <div className="absolute left-0 right-0 border-t-2 border-red-500/70 top-[61.8%]"></div>
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          Golden Ratio (Red Lines)
                        </div>
                      </>
                    )}
                    {overlayType === "thirds" && (
                      <>
                        <div className="absolute top-0 bottom-0 border-l-2 border-green-500/70 left-[33.33%]"></div>
                        <div className="absolute top-0 bottom-0 border-l-2 border-green-500/70 left-[66.66%]"></div>
                        <div className="absolute left-0 right-0 border-t-2 border-green-500/70 top-[33.33%]"></div>
                        <div className="absolute left-0 right-0 border-t-2 border-green-500/70 top-[66.66%]"></div>
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          Rule of Thirds (Green Lines)
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                  <Layers className="h-10 w-10 opacity-20" />
                  <p>Upload an image to start</p>
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md">
              <p className="font-semibold mb-1">How to use:</p>
              {overlayType === "golden" ? (
                <p>Align your hero element with the red intersections. The Golden Ratio (1.618) creates naturally pleasing asymmetrical balance.</p>
              ) : (
                <p>Place key elements along the green lines or at their intersections. The Rule of Thirds is a classic composition technique for balanced visuals.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
