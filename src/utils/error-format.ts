export interface APIError {
  code: number;
  message: string;
}

export default class ErrorFormat {
  public static format(error: APIError) {
    return {
      ...{
        message: error.message,
        code: error.code
      }
    };
  }
}
