import {
  CommonVerifyError,
  CommonVerifyErrorConstructorArgs,
} from "./common-verify-error";

export class BaileysCommunicationError extends CommonVerifyError {
  constructor(args: CommonVerifyErrorConstructorArgs) {
    super("Erro na comunicação com o baileys", args);
  }
}
