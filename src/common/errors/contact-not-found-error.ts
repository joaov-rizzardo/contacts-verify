import {
  CommonVerifyError,
  CommonVerifyErrorConstructorArgs,
} from "./common-verify-error";

export class ContactNotFoundError extends CommonVerifyError {
  constructor(args: CommonVerifyErrorConstructorArgs) {
    super("Contato não encontrado", args);
  }
}
