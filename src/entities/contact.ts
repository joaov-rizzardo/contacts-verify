type ContactConstructorType = {
  id: string;
  name: string;
  phoneNumber: string;
  jid: string;
  workspaceId: string;
  email?: string;
  createdAt: Date;
};

export class Contact {
  private id: string;
  private name: string;
  private phoneNumber: string;
  private jid: string;
  private workspaceId: string;
  private email?: string;
  private createdAt: Date;

  constructor(args: ContactConstructorType) {
    this.id = args.id;
    this.name = args.name;
    this.phoneNumber = args.phoneNumber;
    this.jid = args.jid;
    this.workspaceId = args.workspaceId;
    this.email = args.email;
    this.createdAt = args.createdAt;
  }

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getPhoneNumber() {
    return this.phoneNumber;
  }

  public getJid() {
    return this.jid;
  }

  public getWorkspaceId() {
    return this.workspaceId;
  }

  public getEmail() {
    return this.email;
  }

  public getCreatedAt() {
    return this.createdAt;
  }
}
