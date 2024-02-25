import {
  DatabaseError,
  DatabaseUnknownClientError,
  DatabaseValidationError
} from "@/repositories/handle-database-errors";
import ErrorFormat, { APIError } from "@/utils/error-format";
import { Response } from "express";
import logger from "@/logger";

export abstract class BaseController {
  protected sendCreateErrorResponse(response: Response, error: unknown) {
    if (
      error instanceof DatabaseValidationError ||
      error instanceof DatabaseUnknownClientError
    ) {
      const clientErrors = this.handleDatabaseClientErrors(error);
      response.status(clientErrors.code).send(
        ErrorFormat.format({
          code: clientErrors.code,
          message: clientErrors.error
        })
      );
    } else {
      logger.error(JSON.stringify(error));
      response
        .status(500)
        .send(
          ErrorFormat.format({ code: 500, message: "Internal Server Error" })
        );
    }
  }

  private handleDatabaseClientErrors(error: DatabaseError) {
    if (error instanceof DatabaseValidationError) {
      return { code: 409, error: error.message };
    }
    return { code: 400, error: error.message };
  }

  protected customErrorResponse(
    response: Response,
    apiError: APIError
  ): Response {
    return response.status(apiError.code).send(ErrorFormat.format(apiError));
  }
}
