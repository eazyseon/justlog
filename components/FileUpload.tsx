"use client";

import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setQuestions(null);
    setError(null);

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("PDF 파일만 업로드 가능합니다.");
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setQuestions(null);

    try {
      // FormData에 파일 담기
      const formData = new FormData();
      formData.append("file", file);

      // API 호출
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setQuestions(data.questions);
      } else {
        setError(data.error || "오류가 발생했습니다.");
      }
    } catch (err) {
      setError("서버 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">이력서 기반 면접 질문 생성기</h1>

      {/* 파일 업로드 영역 */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full"
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            선택된 파일: {file.name}
          </p>
        )}
      </div>

      {/* 분석 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium
                   hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition-colors"
      >
        {loading ? "분석 중..." : "면접 질문 생성하기"}
      </button>

      {/* 에러 메시지 */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* 결과 표시 */}
      {questions && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">생성된 면접 질문</h2>
          <div className="whitespace-pre-wrap text-gray-800">
            {questions}
          </div>
        </div>
      )}
    </div>
  );
}
