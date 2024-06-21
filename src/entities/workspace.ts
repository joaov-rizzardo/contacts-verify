type WorkspaceConstructorType = {
  id: string;
  name: string;
  status: string;
  instance?: string;
  phoneNumber?: string;
  jid?: string;
};

export class Workspace {
  private id: string;
  private name: string;
  private status: string;
  private instance?: string;
  private phoneNumber?: string;
  private jid?: string;

  constructor(args: WorkspaceConstructorType) {
    this.id = args.id;
    this.name = args.name;
    this.status = args.status;
    this.instance = args.instance;
    this.phoneNumber = args.phoneNumber;
    this.jid = args.jid;
  }

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getStatus() {
    return this.status;
  }

  public getInstance() {
    return this.instance;
  }

  public getPhoneNumber() {
    return this.phoneNumber;
  }

  public getJid() {
    return this.jid;
  }
}
