"use client";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { User } from "next-auth";
import { Loader2, Pencil } from "lucide-react";
import { updateProfile } from "./actions";

export function ProfileForm({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    if (imageFile) formData.append("image", imageFile);
    const result = await updateProfile({ name, image: imageFile ?? undefined });
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated successfully!");
    }
  };

  const avatarSrc = preview ?? user.image ?? null;

  return (
    <form onSubmit={handleSubmit}>
      {/* Avatar */}
      <div className="flex flex-col items-center pt-6 pb-8">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative group focus:outline-none"
    >
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 overflow-hidden">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-medium text-emerald-700">
                {user.name?.[0]?.toUpperCase() ?? "?"}
              </span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center shadow-sm border-2 border-background">
            <Pencil size={12} className="text-white" />
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <p className="mt-3 text-[15px] font-medium text-foreground">{user.name || "Your Name"}</p>
        <p className="text-[13px] text-muted-foreground">{user.email}</p>
      </div>

      {/* Fields */}
      <div className="space-y-6 px-5">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            defaultValue={user.name || ""}
            required
            placeholder="Enter your name"
            className="w-full bg-transparent border-0 border-b border-border pb-2 text-[15px] text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-emerald-600 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Email Address
          </label>
          <input
            type="email"
            value={user.email || ""}
            disabled
            className="w-full bg-transparent border-0 border-b border-border pb-2 text-[15px] text-muted-foreground outline-none cursor-not-allowed"
          />
          <p className="text-[11px] text-muted-foreground/70">Email cannot be changed</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-11 w-full rounded-full bg-emerald-700 text-white text-[14px] font-medium hover:bg-emerald-800 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}