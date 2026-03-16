import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateLinkUseCase } from "./create-link";
import { isRight, isLeft } from "@/main/shared/either";

const createDbMock = () =>
  ({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
  }) as any;

describe("CreateLinkUseCase", () => {
  let dbMock: ReturnType<typeof createDbMock>;
  let useCase: CreateLinkUseCase;

  beforeEach(() => {
    dbMock = createDbMock();
    useCase = new CreateLinkUseCase(dbMock);
  });

  it("should create a link successfully", async () => {
    dbMock.returning.mockResolvedValueOnce([
      {
        id: "1",
        originalUrl: "https://test.com",
        shortCode: "abc",
        accessCount: 0,
        createdAt: new Date(),
      },
    ]);

    const result = await useCase.execute({
      originalUrl: "https://test.com",
      shortCode: "abc",
    });

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.right.shortCode).toBe("abc");
    }
  });

  it("should return an error if shortCode already exists", async () => {
    dbMock.where.mockResolvedValueOnce([{ id: "existing" }]);

    const result = await useCase.execute({
      originalUrl: "https://test.com",
      shortCode: "abc",
    });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.left.message).toBe("URL encurtada já existente");
    }
  });
});
