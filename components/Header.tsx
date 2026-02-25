import Link from "next/link";
import { Container, Heading } from "@radix-ui/themes";

export default function Header() {
  return (
    <Container size="3" px="4" py="4">
      <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Heading size="4" weight="bold">
          CHAGOK
        </Heading>
      </Link>
    </Container>
  );
}
