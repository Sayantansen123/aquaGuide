import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadPictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const UploadPictureModal = ({
  isOpen,
  onClose,
  onUpload,
}: UploadPictureModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      handleClose();
    }
  };

  const handleClose = () => {
    setPreview(null);
    setSelectedFile(null);
    onClose();
  };

  const clearPreview = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Upload Profile Picture
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={clearPreview}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/30 hover:border-primary/50"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-primary/10">
                  <ImageIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium">
                    Drag and drop your image here
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    or click to browse from your files
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supports: JPG, PNG, GIF (Max 5MB)
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile}
              className="bg-primary hover:bg-primary/90"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPictureModal;
