"use client";

import { useState, useRef } from "react";
import {
  Card,
  Button,
  Text,
  Heading,
  Flex,
  Box,
  Callout,
  Spinner,
} from "@radix-ui/themes";

function parseQuestions(raw: string): string[] {
  const lines = raw.split("\n").filter((l) => l.trim() && l.trim() !== "---");
  const questions: string[] = [];
  let current = "";
  let foundFirst = false;

  for (const line of lines) {
    if (/^\d+[\.\)]\s/.test(line.trim())) {
      if (foundFirst && current) questions.push(current.trim());
      foundFirst = true;
      current = line.trim().replace(/^\d+[\.\)]\s*/, "");
    } else if (foundFirst) {
      current += " " + line.trim();
    }
  }
  if (foundFirst && current) questions.push(current.trim());

  return questions.length > 0 ? questions : [raw];
}

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setQuestions(null);
    setError(null);

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      setError("PDF 파일만 업로드 가능합니다.");
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setQuestions(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

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
    } catch {
      setError("서버 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const parsedQuestions = questions ? parseQuestions(questions) : [];

  return (
    <Flex direction="column" gap="5">
      <Heading size="6" weight="bold">
        이력서 업로드
      </Heading>
      <Text size="3" color="gray">
        PDF 이력서를 업로드하면 AI가 맞춤 면접 질문을 생성합니다.
      </Text>

      {/* Upload Area */}
      <Card
        size="3"
        style={{ cursor: "pointer" }}
        onClick={() => inputRef.current?.click()}
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          gap="3"
          py="6"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--gray-8)" }}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <Text size="2" color="gray">
            {file
              ? file.name
              : "클릭하여 PDF 파일을 선택하세요"}
          </Text>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </Flex>
      </Card>

      {/* Submit Button */}
      <Button
        size="3"
        variant="solid"
        highContrast
        disabled={!file || loading}
        onClick={handleSubmit}
        style={{ cursor: file && !loading ? "pointer" : "not-allowed" }}
      >
        {loading ? (
          <Flex align="center" gap="2">
            <Spinner size="1" />
            분석 중...
          </Flex>
        ) : (
          "면접 질문 생성하기"
        )}
      </Button>

      {/* Error */}
      {error && (
        <Callout.Root color="red" size="2">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      {/* Results */}
      {questions && (
        <Flex direction="column" gap="4">
          <Heading size="5" weight="bold">
            생성된 면접 질문
          </Heading>
          {parsedQuestions.map((q, i) => (
            <Card key={i} size="2">
              <Flex gap="3" align="start">
                <Box>
                  <Text size="5" weight="bold" color="gray">
                    {String(i + 1).padStart(2, "0")}
                  </Text>
                </Box>
                <Text size="3" style={{ lineHeight: 1.6 }}>
                  {q}
                </Text>
              </Flex>
            </Card>
          ))}
        </Flex>
      )}
    </Flex>
  );
}
