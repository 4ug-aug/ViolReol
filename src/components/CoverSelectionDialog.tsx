import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, ImageOff } from "lucide-react";
import { useState } from "react";

interface CoverSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  covers: string[];
  isLoading: boolean;
  onSelect: (coverUrl: string | null) => void;
}

export function CoverSelectionDialog({
  open,
  onOpenChange,
  covers,
  isLoading,
  onSelect,
}: CoverSelectionDialogProps) {
  const [selectedCover, setSelectedCover] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleCoverClick = (coverUrl: string) => {
    setSelectedCover(coverUrl);
  };

  const handleNoCoverClick = () => {
    setSelectedCover(null);
  };

  const handleConfirm = () => {
    onSelect(selectedCover);
    setSelectedCover(null);
    setImageErrors(new Set());
    onOpenChange(false);
  };

  const handleImageError = (coverUrl: string) => {
    setImageErrors((prev) => new Set(prev).add(coverUrl));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif">Select a Book Cover</DialogTitle>
          <DialogDescription>
            Choose a cover for your book, or select "No Cover" to skip.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
          </div>
        ) : covers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ImageOff className="h-12 w-12 text-stone-300 mb-4" />
            <p className="text-stone-500 text-sm mb-6">
              No covers found for this book.
            </p>
            <Button
              onClick={() => {
                onSelect(null);
                onOpenChange(false);
              }}
              variant="outline"
            >
              Continue Without Cover
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 py-4">
              {covers.map((coverUrl, index) => {
                const hasError = imageErrors.has(coverUrl);
                const isSelected = selectedCover === coverUrl;

                return (
                  <button
                    key={index}
                    onClick={() => handleCoverClick(coverUrl)}
                    className={`relative aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all ${
                      isSelected
                        ? "border-stone-800 ring-2 ring-stone-800 ring-offset-2"
                        : "border-stone-200 hover:border-stone-400"
                    }`}
                  >
                    {hasError ? (
                      <div className="w-full h-full flex items-center justify-center bg-stone-100">
                        <ImageOff className="h-8 w-8 text-stone-400" />
                      </div>
                    ) : (
                      <img
                        src={coverUrl}
                        alt={`Cover option ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(coverUrl)}
                      />
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-stone-800/10 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-stone-100">
              <Button
                onClick={handleNoCoverClick}
                variant={selectedCover === null ? "default" : "outline"}
                className={
                  selectedCover === null
                    ? "bg-stone-800 hover:bg-stone-700"
                    : ""
                }
              >
                <ImageOff className="h-4 w-4 mr-2" />
                No Cover
              </Button>

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedCover(null);
                    setImageErrors(new Set());
                    onOpenChange(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="bg-stone-800 hover:bg-stone-700"
                >
                  Confirm Selection
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

