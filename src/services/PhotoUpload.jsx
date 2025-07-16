import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import "./MediaUpload.scss";

const PhotoUploader = () => {
  const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    const allImages = acceptedFiles.every((file) =>
      file.type.startsWith("image/")
    );

    if (!allImages) {
      alert("Please drop only image files.");
      return;
    }

    const newFiles = acceptedFiles.filter(
      (newFile) => !files.some((file) => file.name === newFile.name)
    );

    const filesWithPreview = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...filesWithPreview]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    console.log("Files ready to upload:", files);

    const formData = new FormData();
    formData.append("operation", "upload");

    files.forEach(({ file, preview }) => {
      formData.append("previews", preview);
      formData.append("payloads", file);
    });

    try {
      const res = await fetch("http://localhost:3007/api/upload-media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      alert("Files uploaded successfully!");
      setFiles([]);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Upload failed");
    }
  };

  const removeFile = (previewUrl) => {
    setFiles((prev) => prev.filter((file) => file.preview !== previewUrl));
  };

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div className="photo-uploader-container">
      <span className="title">Upload Photo</span>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "dropzone-active" : ""}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the photos here...</p>
        ) : (
          <p>Drag & drop photos here, or click to select files</p>
        )}
      </div>

      <div className="preview-container">
        {files.length > 0 && (
          <>
            <h2 className="preview-title">Preview</h2>
            <div className="preview-grid">
              {files.map((file, index) => (
                <div key={index} className="preview-item">
                  <img
                    src={file.preview}
                    alt="Preview"
                    className="preview-image"
                  />
                  <button
                    onClick={() => removeFile(file.preview)}
                    className="remove-button"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {files.length > 0 && (
        <button onClick={handleUpload} className="upload-button">
          Upload Photo
        </button>
      )}
    </div>
  );
};

export default PhotoUploader;
