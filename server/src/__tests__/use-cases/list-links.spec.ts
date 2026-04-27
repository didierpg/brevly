import { listLinksUseCase } from "@/application/use-cases/list-links";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryLinkRepository } from "../mocks/in-memory-link-repository";
import { isRight } from "@/core/either";

describe("", () => {
  let repository: InMemoryLinkRepository;
  let sut: ReturnType<typeof listLinksUseCase>;

  beforeEach(() => {
    repository = new InMemoryLinkRepository();
    sut = listLinksUseCase(repository);
  });

  it("should be able to list all links ordered by creation date", async () => {
    const baseLink = {
      id: "any-id",
      originalUrl: "https://google.com",
      shortCode: "any-code",
      accessCount: 0,
      createdAt: new Date(),
    };

    await repository.create({
      ...baseLink,
      shortCode: "code-1",
      createdAt: new Date("2026-03-20"),
    });
    await repository.create({
      ...baseLink,
      shortCode: "code-2",
      createdAt: new Date("2026-03-25"),
    });

    const result = await sut();

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.right).toHaveLength(2);
      expect(result.right[0].shortCode).toBe("code-2");
    }
  });
});
