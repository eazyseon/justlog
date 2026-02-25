import Link from "next/link";
import {
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Card,
  Box,
} from "@radix-ui/themes";

export default function Home() {
  return (
    <Box style={{ minHeight: "100vh", background: "var(--gray-1)" }}>
      {/* Header */}
      <Container size="3" px="4" py="4">
        <Heading size="4" weight="bold">
          CHAGOK
        </Heading>
      </Container>

      {/* Hero */}
      <Container size="2" px="4">
        <Flex direction="column" align="center" gap="6" py="9">
          <Flex direction="column" align="center" gap="3">
            <Heading size="8" align="center" weight="bold">
              경험을 차곡차곡,
              <br />
              면접을 준비하세요
            </Heading>
            <Text
              size="4"
              color="gray"
              align="center"
              style={{ maxWidth: 480 }}
            >
              PDF 이력서를 업로드하고 직무를 선택하면
              <br />
              AI가 직무별 맞춤 면접 질문을 생성해드립니다.
            </Text>
          </Flex>

          <Link href="/upload" style={{ textDecoration: "none" }}>
            <Button
              size="4"
              variant="solid"
              highContrast
              style={{ cursor: "pointer" }}
            >
              시작하기
            </Button>
          </Link>
        </Flex>
      </Container>

      {/* 3-Step Cards */}
      <Container size="3" px="4" pb="9">
        <Flex
          direction={{ initial: "column", sm: "row" }}
          gap="4"
          justify="center"
        >
          <Card size="3" style={{ flex: 1 }}>
            <Flex direction="column" gap="2">
              <Text size="6" weight="bold" color="gray">
                01
              </Text>
              <Heading size="4">이력서 업로드</Heading>
              <Text size="2" color="gray">
                PDF 형식의 이력서 파일을 드래그하거나 선택하여 업로드합니다.
              </Text>
            </Flex>
          </Card>

          <Card size="3" style={{ flex: 1 }}>
            <Flex direction="column" gap="2">
              <Text size="6" weight="bold" color="gray">
                02
              </Text>
              <Heading size="4">AI 분석</Heading>
              <Text size="2" color="gray">
                Gemini AI가 이력서 내용을 분석하여 핵심 경험과 역량을
                파악합니다.
              </Text>
            </Flex>
          </Card>

          <Card size="3" style={{ flex: 1 }}>
            <Flex direction="column" gap="2">
              <Text size="6" weight="bold" color="gray">
                03
              </Text>
              <Heading size="4">질문 생성</Heading>
              <Text size="2" color="gray">
                이력서 맞춤형 면접 질문을 생성하여 실전 면접에 대비할 수
                있습니다.
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Container>
    </Box>
  );
}
