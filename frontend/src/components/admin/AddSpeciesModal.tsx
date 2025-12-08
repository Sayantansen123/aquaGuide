import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Upload, X, ImagePlus } from "lucide-react";

interface AddSpeciesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSpeciesModal = ({ isOpen, onClose }: AddSpeciesModalProps) => {
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);
  const [otherImages, setOtherImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    commonName: "",
    scientificName: "",
    family: "",
    origin: "",
    waterType: "",
    minTemp: "",
    maxTemp: "",
    minPh: "",
    maxPh: "",
    minHardness: "",
    maxHardness: "",
    dietType: "",
    careLevel: "",
    temperament: "",
    maxSize: "",
    minTankSize: "",
    dietInfo: "",
    description: "",
    breedingDifficulty: "",
    breedingNotes: "",
    status: "draft",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrimaryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrimaryImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOtherImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setOtherImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeOtherImage = (index: number) => {
    setOtherImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    console.log("Primary Image:", primaryImage);
    console.log("Other Images:", otherImages);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-card border-border">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Add New Species
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] px-6">
          <div className="space-y-6 pb-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                  1
                </span>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commonName">Common Name *</Label>
                  <Input
                    id="commonName"
                    placeholder="e.g., Clownfish"
                    value={formData.commonName}
                    onChange={(e) =>
                      handleInputChange("commonName", e.target.value)
                    }
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scientificName">Scientific Name *</Label>
                  <Input
                    id="scientificName"
                    placeholder="e.g., Amphiprion ocellaris"
                    value={formData.scientificName}
                    onChange={(e) =>
                      handleInputChange("scientificName", e.target.value)
                    }
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="family">Family</Label>
                  <Input
                    id="family"
                    placeholder="e.g., Pomacentridae"
                    value={formData.family}
                    onChange={(e) =>
                      handleInputChange("family", e.target.value)
                    }
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    placeholder="e.g., Indo-Pacific"
                    value={formData.origin}
                    onChange={(e) =>
                      handleInputChange("origin", e.target.value)
                    }
                    className="bg-background border-border"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Water Parameters */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                  2
                </span>
                Water Parameters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                  <Label>Water Type *</Label>
                  <Select
                    value={formData.waterType}
                    onValueChange={(v) => handleInputChange("waterType", v)}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select water type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="freshwater">Freshwater</SelectItem>
                      <SelectItem value="marine">Marine</SelectItem>
                      <SelectItem value="brackish">Brackish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minTemp">Min Temperature (°C)</Label>
                  <Input
                    id="minTemp"
                    type="number"
                    placeholder="e.g., 24"
                    value={formData.minTemp}
                    onChange={(e) =>
                      handleInputChange("minTemp", e.target.value)
                    }
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxTemp">Max Temperature (°C)</Label>
                  <Input
                    id="maxTemp"
                    type="number"
                    placeholder="e.g., 28"
                    value={formData.maxTemp}
                    onChange={(e) =>
                      handleInputChange("maxTemp", e.target.value)
                    }
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minPh">Min pH</Label>
                  <Input
                    id="minPh"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 7.0"
                    value={formData.minPh}
                    onChange={(e) => handleInputChange("minPh", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPh">Max pH</Label>
                  <Input
                    id="maxPh"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 8.4"
                    value={formData.maxPh}
                    onChange={(e) => handleInputChange("maxPh", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minHardness">Min Hardness (dGH)</Label>
                  <Input
                    id="minHardness"
                    type="number"
                    placeholder="e.g., 8"
                    value={formData.minHardness}
                    onChange={(e) =>
                      handleInputChange("minHardness", e.target.value)
                    }
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxHardness">Max Hardness (dGH)</Label>
                  <Input
                    id="maxHardness"
                    type="number"
                    placeholder="e.g., 12"
                    value={formData.maxHardness}
                    onChange={(e) =>
                      handleInputChange("maxHardness", e.target.value)
                    }
                    className="bg-background border-border"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Care Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                  3
                </span>
                Care Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Diet Type</Label>
                  <Select
                    value={formData.dietType}
                    onValueChange={(v) => handleInputChange("dietType", v)}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="herbivore">Herbivore</SelectItem>
                      <SelectItem value="carnivore">Carnivore</SelectItem>
                      <SelectItem value="omnivore">Omnivore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Care Level</Label>
                  <Select
                    value={formData.careLevel}
                    onValueChange={(v) => handleInputChange("careLevel", v)}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select care level" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="very-easy">Very Easy</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="difficult">Difficult</SelectItem>
                      <SelectItem value="very-difficult">
                        Very Difficult
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Temperament</Label>
                  <Select
                    value={formData.temperament}
                    onValueChange={(v) => handleInputChange("temperament", v)}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select temperament" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="peaceful">Peaceful</SelectItem>
                      <SelectItem value="semi-aggressive">
                        Semi-Aggressive
                      </SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                      <SelectItem value="territorial">Territorial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSize">Max Size (cm)</Label>
                  <Input
                    id="maxSize"
                    type="number"
                    placeholder="e.g., 11"
                    value={formData.maxSize}
                    onChange={(e) =>
                      handleInputChange("maxSize", e.target.value)
                    }
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minTankSize">Min Tank Size (Liters)</Label>
                  <Input
                    id="minTankSize"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.minTankSize}
                    onChange={(e) =>
                      handleInputChange("minTankSize", e.target.value)
                    }
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dietInfo">Diet Information</Label>
                <Textarea
                  id="dietInfo"
                  placeholder="Describe the dietary requirements..."
                  value={formData.dietInfo}
                  onChange={(e) =>
                    handleInputChange("dietInfo", e.target.value)
                  }
                  className="bg-background border-border min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="General description of the species..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="bg-background border-border min-h-[100px]"
                />
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                  4
                </span>
                Media
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Primary Image */}
                <div className="space-y-2">
                  <Label>Primary Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    {primaryImage ? (
                      <div className="relative inline-block">
                        <img
                          src={primaryImage}
                          alt="Primary"
                          className="max-h-40 rounded-lg object-cover"
                        />
                        <button
                          onClick={() => setPrimaryImage(null)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block py-8">
                        <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload primary image
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePrimaryImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Other Images */}
                <div className="space-y-2">
                  <Label>Other Images</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {otherImages.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={img}
                            alt={`Other ${index + 1}`}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <button
                            onClick={() => removeOtherImage(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <label className="cursor-pointer flex items-center justify-center gap-2 py-4 hover:bg-muted/50 rounded-lg transition-colors">
                      <ImagePlus className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Add more images
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleOtherImagesUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Breeding Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                  5
                </span>
                Breeding Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Breeding Difficulty</Label>
                  <Select
                    value={formData.breedingDifficulty}
                    onValueChange={(v) =>
                      handleInputChange("breedingDifficulty", v)
                    }
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="very-easy">Very Easy</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="difficult">Difficult</SelectItem>
                      <SelectItem value="very-difficult">
                        Very Difficult
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="breedingNotes">Breeding Notes</Label>
                <Textarea
                  id="breedingNotes"
                  placeholder="Notes about breeding this species..."
                  value={formData.breedingNotes}
                  onChange={(e) =>
                    handleInputChange("breedingNotes", e.target.value)
                  }
                  className="bg-background border-border min-h-[80px]"
                />
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Publication Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                  6
                </span>
                Publication Status
              </h3>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleInputChange("status", v)}
                >
                  <SelectTrigger className="bg-background border-border w-full sm:w-[200px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
          >
            Add Species
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSpeciesModal;
