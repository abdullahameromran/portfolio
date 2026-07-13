import { useEffect, useState } from "react";

interface ImageUploaderProps {
  projectId: string;
  images?: string[];
  onChange?: (images: string[]) => void;
}

export default function ImageUploader({ projectId, images = [], onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [localImages, setLocalImages] = useState<string[]>(images || []);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    setLocalImages(images || []);
  }, [images, projectId]);

  const notify = (next: string[]) => {
    setLocalImages(next);
    onChange?.(next);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError("");
    let nextImages = [...localImages];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        const base64 = await fileToBase64(f);
        // Remove the data URL prefix
        const parts = base64.split(",");
        const contentBase64 = parts.length > 1 ? parts[1] : parts[0];

        const res = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId, filename: f.name, contentBase64, contentType: f.type })
        });

        const data = await res.json().catch(() => null);
        if (res.ok) {
          nextImages = [...nextImages, data.publicUrl];
          notify(nextImages);
        } else {
          const message = data?.details || data?.error || "Upload failed. Check Supabase Storage bucket and policies.";
          setUploadError(message);
          console.error("Upload failed", message);
        }
      } catch (e) {
        setUploadError("File upload failed. Please try a smaller image.");
        console.error("File upload error", e);
      }
    }
    setUploading(false);
  };

  const fileToBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

  const removeAt = (idx: number) => {
    const next = localImages.slice(0, idx).concat(localImages.slice(idx + 1));
    notify(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <input type="file" multiple accept="image/*" onChange={(e) => handleFiles(e.target.files)} />
        {uploading && <span className="text-xs text-slate-400">Uploading...</span>}
      </div>
      {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}

      <div className="flex flex-wrap gap-2">
        {localImages.map((img, i) => (
          <div key={i} className="relative w-28 h-20 rounded overflow-hidden border border-slate-800 bg-slate-900">
            <img src={img} alt={`img-${i}`} className="w-full h-full object-cover" />
            <button onClick={() => removeAt(i)} className="absolute top-1 right-1 bg-black/50 text-white rounded px-1 text-xs">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
