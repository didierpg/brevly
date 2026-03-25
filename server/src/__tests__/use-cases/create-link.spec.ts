import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryLinkRepository } from "@/__tests__/mocks/in-memory-link-repository";
import { createLinkUseCase } from "@/application/use-cases/create-link";
import { LinkErrors } from "@/domain/errors/link-errors";
import { isLeft, isRight } from "@/core/either";

describe("Create Link Use Case", () => {
  let repository: InMemoryLinkRepository;
  let sut: ReturnType<typeof createLinkUseCase>;

  beforeEach(() => {
    repository = new InMemoryLinkRepository();
    sut = createLinkUseCase(repository);
  });

  it("should be able to create a new shortened link", async () => {
    const result = await sut({
      originalUrl: "https://google.com",
      shortCode: "google",
    });

    expect(isRight(result)).toBe(true);

    if (isRight(result)) {
      expect(result.right.id).toBeDefined();
      expect(repository.items).toHaveLength(1);
      expect(repository.items[0].shortCode).toBe("google");
    }
  });

  it("should not be able to create a link with an existing short code", async () => {
    const shortCode = "duplicate";

    await sut({
      originalUrl: "https://first.com",
      shortCode,
    });

    const result = await sut({
      originalUrl: "https://second.com",
      shortCode,
    });

    expect(isLeft(result)).toBe(true);

    if (isLeft(result)) {
      expect(result.left).toEqual(LinkErrors.ShortCodeAlreadyInUse(shortCode));
    }
  });
});
