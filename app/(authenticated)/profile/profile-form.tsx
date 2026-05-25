"use client";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { User } from "next-auth";
import {
  CircleUser,
  CircleUserRound,
  Loader2,
  Pencil,
  User as UserIcon,
} from "lucide-react";
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
          <div className="w-28 h-28 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 overflow-hidden shadow-sm">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 0C21.5196 0 23.9359 1.00089 25.7175 2.78249C27.4991 4.56408 28.5 6.98044 28.5 9.5C28.5 12.0196 27.4991 14.4359 25.7175 16.2175C23.9359 17.9991 21.5196 19 19 19C16.4804 19 14.0641 17.9991 12.2825 16.2175C10.5009 14.4359 9.5 12.0196 9.5 9.5C9.5 6.98044 10.5009 4.56408 12.2825 2.78249C14.0641 1.00089 16.4804 0 19 0ZM19 23.75C29.4975 23.75 38 28.0012 38 33.25V38H0V33.25C0 28.0012 8.5025 23.75 19 23.75Z"
                  fill="#989898"
                />
              </svg>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center shadow border-2 border-background">
            <Pencil size={13} className="text-white" />
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <p className="mt-3 text-lg font-semibold text-foreground">
          {user.name || "Your Name"}
        </p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
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
            className="w-full bg-transparent border-0 border-b border-border pb-3 text-[15px] text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-emerald-600 transition-colors"
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
          <p className="text-[11px] text-muted-foreground/70">
            Email cannot be changed
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-10 w-full rounded-xl bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}
