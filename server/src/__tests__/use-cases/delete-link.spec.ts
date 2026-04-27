import { deleteLinkUseCase } from "@/application/use-cases/delete-link";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryLinkRepository } from "@/__tests__/mocks/in-memory-link-repository";
import { isLeft, isRight } from "@/core/either";
import { LinkErrors } from "@/domain/errors/link-errors";

describe("Unit tests for delete link endpoint", () => {
  let repository: InMemoryLinkRepository;
  let sut: ReturnType<typeof deleteLinkUseCase>;

  beforeEach(() => {
    repository = new InMemoryLinkRepository();
    sut = deleteLinkUseCase(repository);

    repository.items.push({
      id: "link-id",
      shortCode: "short-code",
      originalUrl: "original-url",
      accessCount: 0,
      createdAt: new Date(),
    });
  });

  it("should remove a link from the links", async () => {
    const result = await sut("short-code");
    expect(isRight(result)).toBeTruthy();
    expect(repository.items).toHaveLength(0);
  });

  it("should not return link not found", async () => {
    const result = await sut("unexistent-link");
    expect(isLeft(result)).toBeTruthy();
    expect(result.left).toStrictEqual(
      LinkErrors.LinkNotFoundByShortCode("unexistent-link"),
    );
  });
});
