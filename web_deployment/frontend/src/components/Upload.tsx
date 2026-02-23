import React from "react";

interface UploadProps {
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  imagePreview: string | null;
  handleDetect: () => void;
}

function Upload({
  setSelectedFile,
  setImagePreview,
  imagePreview,
  handleDetect,
}: UploadProps) {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {imagePreview && (
        <div>
          <h3>Preview</h3>
          <img src={imagePreview} alt="Preview" width="300" />
          <br />
          <button onClick={handleDetect}>Detect Text</button>
        </div>
      )}
    </div>
  );
}

export default Upload;
