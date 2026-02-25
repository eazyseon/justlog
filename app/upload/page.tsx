import FileUpload from "@/components/FileUpload";
import { Container, Box } from "@radix-ui/themes";

export default function UploadPage() {
  return (
    <Box style={{ minHeight: "100vh", background: "var(--gray-1)" }}>
      {/* Content */}
      <Container size="2" px="4" pb="9">
        <FileUpload />
      </Container>
    </Box>
  );
}
