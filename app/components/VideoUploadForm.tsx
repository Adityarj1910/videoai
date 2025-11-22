"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

function VideoUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !videoFile) {
      setError("Title, description, and video file are required");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", videoFile);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const res = await fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnail(null);
      router.push("/videos");
    } catch (err: any) {
      setError(err.message || "Failed to upload video");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upload Video</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Video Title</span>
          </label>
          <input
            type="text"
            placeholder="Enter video title"
            className="input input-bordered"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            placeholder="Enter video description"
            className="textarea textarea-bordered"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Video File *</span>
          </label>
          <input
            type="file"
            accept="video/*"
            className="file-input file-input-bordered"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Thumbnail (Optional)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered"
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}

export default VideoUploadForm;