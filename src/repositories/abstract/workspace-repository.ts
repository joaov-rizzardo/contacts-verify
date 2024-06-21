import { Workspace } from "../../entities/workspace";

export abstract class WorkspaceRepository {
  abstract findInstance(
    workspaceId: string
  ): string | null | Promise<string | null>;
  abstract findById(id: string): Promise<null | Workspace> | null | Workspace;
}
