export type CommonVerifyErrorConstructorArgs = {
  workspaceId: string;
  workspaceName?: string;
  contactId: string;
  contactName?: string;
};

export class CommonVerifyError extends Error {
  private workspaceId: string;
  private workspaceName?: string;
  private contactId: string;
  private contactName?: string;

  constructor(message: string, args: CommonVerifyErrorConstructorArgs) {
    super(message);
    this.workspaceId = args.workspaceId;
    this.workspaceName = args.workspaceName;
    this.contactId = args.contactId;
    this.contactName = args.contactName;
  }

  public getWorkspace(): string {
    return this.workspaceName ?? this.workspaceId;
  }

  public getContact(): string {
    return this.contactName ?? this.contactId;
  }
}
