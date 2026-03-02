import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

// Gemini AI 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    // 1. 요청에서 PDF 파일 가져오기
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const role = formData.get("role") as string | null;
    const experience = formData.get("experience") as string | null;
    const questionType = formData.get("questionType") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "파일이 없습니다." },
        { status: 400 }
      );
    }

    // 2. PDF에서 텍스트 추출
    const arrayBuffer = await file.arrayBuffer();
    const pdfResult = await extractText(new Uint8Array(arrayBuffer));
    const resumeText = typeof pdfResult.text === "string"
      ? pdfResult.text
      : Array.isArray(pdfResult.text)
        ? pdfResult.text.join("\n")
        : String(pdfResult.text);

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: "PDF에서 텍스트를 추출할 수 없습니다." },
        { status: 400 }
      );
    }

    // 3. Gemini에 면접 질문 생성 요청
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const roleContext = role
      ? `\n지원 직무: ${role}\n해당 직무에서 중요한 역량과 기술을 중심으로 질문을 생성해주세요.\n`
      : "";

    const experienceContext = experience
      ? `\n경력: ${experience}\n해당 경력 수준에 적합한 난이도와 깊이의 질문을 생성해주세요.\n`
      : "";

    const questionTypeMap: Record<string, string> = {
      technical: "기술 질문 위주",
      experience: "경험 질문 위주",
      balanced: "균형 있게",
    };

    const questionTypeContext = questionType && questionTypeMap[questionType]
      ? `\n질문 유형: ${questionTypeMap[questionType]}\n${
          questionType === "technical"
            ? "사용한 기술 스택, 아키텍처 결정, 알고리즘 등 기술적 깊이를 확인하는 질문 위주로 생성해주세요."
            : questionType === "experience"
            ? "이력서에 적힌 프로젝트와 경험에서 구체적인 상황, 역할, 성과를 묻는 질문 위주로 생성해주세요."
            : "기술 질문과 경험 질문을 고르게 섞어서 생성해주세요."
        }\n`
      : "";

    const prompt = `
다음은 지원자의 이력서입니다. 이 이력서를 바탕으로 면접 질문 5개를 생성해주세요.
${roleContext}${experienceContext}${questionTypeContext}
이력서 내용:
${resumeText}

면접 질문 5개를 번호와 함께 작성해주세요.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questions = response.text();

    // 4. 결과 반환
    return NextResponse.json({
      success: true,
      questions: questions,
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "면접 질문 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
