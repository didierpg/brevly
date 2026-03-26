import { describe, it, expect, beforeEach } from "vitest";
import { resolveLinkUseCase } from "@/application/use-cases/resolve-link";
import { InMemoryLinkRepository } from "@/__tests__/mocks/in-memory-link-repository";
import { isLeft, isRight } from "@/core/either";
import { LinkErrors } from "@/domain/errors/link-errors";

describe("Resolve Link Use Case", () => {
  let repository: InMemoryLinkRepository;
  let sut: ReturnType<typeof resolveLinkUseCase>;

  beforeEach(() => {
    repository = new InMemoryLinkRepository();
    sut = resolveLinkUseCase(repository);
  });

  it("should be able to resolve a link and increment access count", async () => {
    const link = {
      id: "any-id",
      originalUrl: "https://google.com",
      shortCode: "goog",
      accessCount: 0,
      createdAt: new Date(),
    };
    repository.items.push(link);

    const result = await sut("goog");

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.right).toBe("https://google.com");
      expect(repository.items[0].accessCount).toBe(1);
    }
  });

  it("should return a LinkNotFound error if code does not exist", async () => {
    const result = await sut("non-existent");

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.left).toEqual(
        LinkErrors.LinkNotFoundByShortCode("non-existent"),
      );
    }
  });
});
