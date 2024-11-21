"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { identifyInsect } from '@/lib/gemini';
import Image from 'next/image';

export function ImageUploader() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Convert the file to base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target?.result as string;
      setImage(base64Image);
      
      try {
        setLoading(true);
        const identification = await identifyInsect(base64Image);
        setResult(identification);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to identify insect",
        });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
  });

  const handleReset = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {!image && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-white/50 bg-white/5' : 'border-white/20 hover:border-white/30'}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-white/50 mb-4" />
          <p className="text-white/80 font-light text-lg">
            {isDragActive
              ? "Drop the image here"
              : "Drag and drop an insect image, or click to select"}
          </p>
          <p className="text-white/50 text-sm mt-2 font-light">
            Supports JPEG, PNG • Max size 4MB
          </p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 text-white/80">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="font-light text-lg">Analyzing image...</p>
        </div>
      )}

      {image && !loading && (
        <div className="space-y-8">
          <div className="w-full aspect-[3/2] relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src={image}
              alt="Uploaded insect"
              fill
              className="object-contain bg-black/20"
            />
          </div>

          {result && (
            <>
              <div 
                className="prose"
                dangerouslySetInnerHTML={{ __html: result }}
              />
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleReset}
                  className="bg-white/10 hover:bg-white/20 text-white border-0"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Upload Another Image
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}