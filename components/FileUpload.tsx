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
  Select,
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
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const roles = [
    { value: "frontend", label: "프론트엔드" },
    { value: "backend", label: "백엔드" },
    { value: "fullstack", label: "풀스택" },
    { value: "mobile", label: "모바일" },
    { value: "devops", label: "DevOps" },
    { value: "data", label: "데이터 엔지니어" },
  ];

  const experiences = [
    { value: "less-than-1", label: "1년 미만" },
    { value: "1-2", label: "1~2년" },
    { value: "3-5", label: "3~5년" },
    { value: "5-10", label: "5~10년" },
    { value: "10-plus", label: "10년 이상" },
  ];

  const questionTypes = [
    { value: "technical", label: "기술 질문 위주" },
    { value: "experience", label: "경험 질문 위주" },
    { value: "balanced", label: "균형 있게" },
  ];

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

  const handleCopy = async () => {
    if (!questions) return;
    const parsedForCopy = parseQuestions(questions);
    const text = parsedForCopy.map((q, i) => `${i + 1}. ${q}`).join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setQuestions(null);
    setCopied(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (role) formData.append("role", role);
      if (experience) formData.append("experience", experience);
      if (questionType) formData.append("questionType", questionType);

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

      {/* Role & Experience Select */}
      <Flex gap="4" direction={{ initial: "column", sm: "row" }}>
        <Flex direction="column" gap="2" style={{ flex: 1 }}>
          <Text size="2" weight="medium">
            지원 직무
          </Text>
          <Select.Root value={role} onValueChange={setRole}>
            <Select.Trigger placeholder="선택사항" />
            <Select.Content>
              {roles.map((r) => (
                <Select.Item key={r.value} value={r.value}>
                  {r.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        <Flex direction="column" gap="2" style={{ flex: 1 }}>
          <Text size="2" weight="medium">
            경력
          </Text>
          <Select.Root value={experience} onValueChange={setExperience}>
            <Select.Trigger placeholder="선택사항" />
            <Select.Content>
              {experiences.map((e) => (
                <Select.Item key={e.value} value={e.value}>
                  {e.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        <Flex direction="column" gap="2" style={{ flex: 1 }}>
          <Text size="2" weight="medium">
            질문 유형
          </Text>
          <Select.Root value={questionType} onValueChange={setQuestionType}>
            <Select.Trigger placeholder="선택사항" />
            <Select.Content>
              {questionTypes.map((q) => (
                <Select.Item key={q.value} value={q.value}>
                  {q.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>

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
          <Flex align="center" justify="between">
            <Heading size="5" weight="bold">
              생성된 면접 질문
            </Heading>
            <Flex gap="2">
              <Button
                size="2"
                variant="soft"
                onClick={handleCopy}
                style={{ cursor: "pointer" }}
              >
                {copied ? "복사됨!" : "전체 복사"}
              </Button>
              <Button
                size="2"
                variant="soft"
                onClick={handleSubmit}
                disabled={loading}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? <Spinner size="1" /> : "다시 생성"}
              </Button>
            </Flex>
          </Flex>
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
