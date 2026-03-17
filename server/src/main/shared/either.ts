export type Left<T> = {
  left: T;
  right?: never;
};

export type Right<U> = {
  left?: never;
  right: U;
};

export type Either<T, U> = NonNullable<Left<T> | Right<U>>;

export const isLeft = <T, U>(e: Either<T, U>): e is Left<T> => "left" in e;

export const isRight = <T, U>(e: Either<T, U>): e is Right<U> => "right" in e;

export const makeLeft = <T>(value: T): Left<T> => ({ left: value });

export const makeRight = <U>(value: U): Right<U> => ({ right: value });

export const unwrapEither = <T, U>(e: Either<T, U>): T | U => {
  if (e.left !== undefined) return e.left;
  return e.right as U;
};
