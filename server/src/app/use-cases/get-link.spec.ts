import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetLinkUseCase } from "./get-link";
import { isRight, isLeft } from "@/main/shared/either";

const createDbMock = () =>
  ({
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
  }) as any;

describe("GetLinkUseCase", () => {
  let dbMock: any;
  let useCase: GetLinkUseCase;

  beforeEach(() => {
    dbMock = createDbMock();
    useCase = new GetLinkUseCase(dbMock);
  });

  it("should return the original URL and increment counter", async () => {
    dbMock.returning.mockResolvedValueOnce([
      {
        originalUrl: "https://google.com",
      },
    ]);

    const result = await useCase.execute({ shortCode: "abc123" });

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.right.originalUrl).toBe("https://google.com");
    }

    expect(dbMock.update).toHaveBeenCalled();
  });

  it("should return an error if link does not exist", async () => {
    dbMock.returning.mockResolvedValueOnce([]);

    const result = await useCase.execute({ shortCode: "invalid" });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.left.message).toBe("Link not found");
    }
  });
});
