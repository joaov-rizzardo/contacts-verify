import { ContactRepository } from "../repositories/abstract/contact-repository";
import { WorkspaceRepository } from "../repositories/abstract/workspace-repository";
import { MongooseContactRepository } from "../repositories/mongoose/mongoose-contact-repository";
import { MongooseWorkspaceRepository } from "../repositories/mongoose/mongoose-workspace-repository";

export class RepositoryProvider {
  private static instances: Map<string, any> = new Map();

  private static mapping = new Map<string, new (...args: any[]) => any>([
    [WorkspaceRepository.name, MongooseWorkspaceRepository],
    [ContactRepository.name, MongooseContactRepository],
  ]);

  static getRepositoryInstance<T>(constructor: abstract new () => T): T {
    const name = constructor.name;
    if (!this.instances.has(name)) {
      const constructor = this.mapping.get(name);
      if (!constructor) throw new Error(`Repository not found ${name}`);
      this.instances.set(name, new constructor());
    }
    return this.instances.get(name);
  }
}
