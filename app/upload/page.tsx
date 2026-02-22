import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import { Container, Heading, Box } from "@radix-ui/themes";

export default function UploadPage() {
  return (
    <Box style={{ minHeight: "100vh", background: "var(--gray-1)" }}>
      {/* Header */}
      <Container size="3" px="4" py="4">
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Heading size="4" weight="bold">
            JustLog
          </Heading>
        </Link>
      </Container>

      {/* Content */}
      <Container size="2" px="4" pb="9">
        <FileUpload />
      </Container>
    </Box>
  );
}
