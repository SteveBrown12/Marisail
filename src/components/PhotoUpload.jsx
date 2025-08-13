import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
// import "./MediaUpload.scss";

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

    const filesWithPreview = newFiles.map((newFile) => ({
      newFile, // ✅ Attach actual File object
      preview: URL.createObjectURL(newFile), // ✅ Generate preview
    }));

    setFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
  };

  // onclick file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    // upload logic

    const formData = new FormData();
    formData.append("operation", "upload");

    files.forEach((fileAndPreviewUrl) => {
      formData.append("previews", JSON.stringify(fileAndPreviewUrl.preview));
      formData.append("payloads", fileAndPreviewUrl.newFile);
    });

    const res = await fetch("http://localhost:3007/api/upload-media", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Upload failed");
    }
    // if server action instead of api handler (not recommended for huge files)
    //uploadServerAction(formData);

    alert("Files uploaded successfully!");
    setFiles([]);
  };

  const removeFile = (previewUrl) => {
    setFiles((prev) => prev.filter((f) => f.preview !== previewUrl));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // react-dropzone v14+ accepts an object map of MIME types
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
        <input {...getInputProps()} multiple={true} />
        {isDragActive ? (
          <p>Drop the files here...</p>
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
