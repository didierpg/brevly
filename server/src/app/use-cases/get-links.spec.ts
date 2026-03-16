import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetLinksUseCase } from "./get-links";
import { Link } from "@/domain/entities/link";
import { isRight } from "@/main/shared/either";

describe("GetLinksUseCase", () => {
  let repositoryMock: any;
  let useCase: GetLinksUseCase;

  beforeEach(() => {
    repositoryMock = {
      findAll: vi.fn(),
    };
    useCase = new GetLinksUseCase(repositoryMock);
  });

  it("should return all links from the repository", async () => {
    const mockLink = new Link({
      id: "1",
      originalUrl: "https://test.com",
      shortCode: "test",
      accessCount: 0,
      createdAt: new Date(),
    });

    repositoryMock.findAll.mockResolvedValue([mockLink]);

    const result = await useCase.execute();

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.right[0]).toBeInstanceOf(Link);
      expect(result.right[0].shortCode).toBe("test");
    }
  });
});
