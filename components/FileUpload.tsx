// components/FileUpload.tsx
"use client";

import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      console.log("파일 선택됨:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });
    } else {
      alert("PDF 파일만 업로드 가능합니다.");
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {file && <p>선택된 파일: {file.name}</p>}
    </div>
  );
}
