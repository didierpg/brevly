import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteLinkUseCase } from "./delete-link";
import { LinksRepository } from "@/domain/repositories/links-repository";
import { isLeft, isRight } from "@/main/shared/either";
import { Link } from "@/domain/entities/link";

describe("DeleteLinkUseCase", () => {
  const link = new Link({
    id: "link-123",
    originalUrl: "https://example.com",
    shortCode: "abc123",
    createdAt: new Date(),
  } as Link);

  const linksRepository = {
    findById: vi.fn(),
    delete: vi.fn(),
    findAll: vi.fn(),
    findByShortCode: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  } as LinksRepository;

  const deleteUseCase = new DeleteLinkUseCase(linksRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete a link successfully", async () => {
    const linkId = "link-123";
    vi.mocked(linksRepository.findById).mockResolvedValue(link);
    vi.mocked(linksRepository.delete).mockResolvedValue(undefined);

    const result = await deleteUseCase.execute(linkId);

    expect(isRight(result)).toBe(true);
    expect(vi.mocked(linksRepository.delete)).toHaveBeenCalledWith(linkId);
  });

  it("should return error when link not found", async () => {
    const linkId = "non-existent";
    vi.mocked(linksRepository.findById).mockResolvedValue(null);

    const result = await deleteUseCase.execute(linkId);

    expect(isLeft(result)).toBe(true);
    expect(vi.mocked(linksRepository.delete)).not.toHaveBeenCalled();
  });

  it("should handle repository errors", async () => {
    const linkId = "link-123";
    vi.mocked(linksRepository.findById).mockResolvedValue(link);
    vi.mocked(linksRepository.delete).mockRejectedValue(
      new Error("Unexpected repository error"),
    );

    const result = await deleteUseCase.execute(linkId);

    expect(isLeft(result)).toBe(true);
    expect(vi.mocked(linksRepository.delete)).toHaveBeenCalledWith(linkId);
  });
});
