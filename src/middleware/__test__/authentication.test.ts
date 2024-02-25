import { describe, beforeEach, expect, it, vitest } from "vitest";
import AuthService from "@/services/jwt";
import { authMiddleware } from "../authentication";
import { Request, Response } from "express";

describe("Authentication middleware", () => {
  let responseFake: Partial<Response>;
  let requestFake: Partial<Request>;

  beforeEach(() => {
    requestFake = {};
    responseFake = {};
  });

  it("Verify token in authorization header", () => {
    const token = AuthService.generateToken("fake-token");

    requestFake = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const fakeNext = vitest.fn();

    authMiddleware(requestFake as Request, responseFake as Response, fakeNext);

    expect(fakeNext).toHaveBeenCalled();
  });

  it("Should return an ERROR if token is not valid", () => {
    requestFake = {
      headers: {
        authorization: "Bearer invalid-token"
      }
    };

    const errorMock = vitest.fn();

    responseFake = {
      status: vitest.fn().mockReturnThis(),
      send: errorMock
    };

    const nextFake = vitest.fn();

    authMiddleware(requestFake as Request, responseFake as Response, nextFake);

    expect(responseFake.status).toHaveBeenCalledWith(401);
    expect(errorMock).toHaveBeenCalledWith({
      code: 401,
      error: "jwt malformed"
    });
  });

  it("Should return an ERROR if token is not provided", () => {
    requestFake = {
      headers: {
        authorization: ""
      }
    };

    const errorMock = vitest.fn();

    responseFake = {
      status: vitest.fn().mockReturnThis(),
      send: errorMock
    };

    const nextFake = vitest.fn();

    authMiddleware(requestFake as Request, responseFake as Response, nextFake);

    expect(responseFake.status).toHaveBeenCalledWith(401);
    expect(errorMock).toHaveBeenCalledWith({
      code: 401,
      error: "jwt must be provided"
    });
  });
});
