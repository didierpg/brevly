import { describe, it, expect, beforeEach } from "vitest";
import { exportLinksUseCase } from "@/application/use-cases/export-links";
import { InMemoryLinkRepository } from "../mocks/in-memory-link-repository";
import { InMemoryStorageProvider } from "../mocks/in-memory-storage-provider";
import { isRight } from "@/core/either";

describe("Export Links Use Case", () => {
  let repository: InMemoryLinkRepository;
  let storage: InMemoryStorageProvider;
  let sut: ReturnType<typeof exportLinksUseCase>;

  beforeEach(() => {
    repository = new InMemoryLinkRepository();
    storage = new InMemoryStorageProvider();
    sut = exportLinksUseCase(repository, storage);

    repository.items.push({
      id: "1",
      originalUrl: "https://google.com",
      shortCode: "goog",
      accessCount: 10,
      createdAt: new Date(),
    });
  });

  it("should be able to export links to a CSV in storage", async () => {
    const result = await sut();

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.right.publicUrl).toContain("https://storage.com/");
      expect(result.right.publicUrl).toContain("-links.csv");
    }
  });
});
