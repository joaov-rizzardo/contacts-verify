import {
  Workspace as WorkspaceModel,
  WorkspaceSchemaType,
  mongoose,
} from "mongoose-models";
import { WorkspaceRepository } from "../abstract/workspace-repository";
import { Workspace } from "../../entities/workspace";

interface WorkspaceModelType extends WorkspaceSchemaType, mongoose.Document {}

export class MongooseWorkspaceRepository implements WorkspaceRepository {
  async findInstance(workspaceId: string): Promise<string | null> {
    const workspace = await WorkspaceModel.findById(workspaceId).select(
      "instance"
    );
    if (!workspace) return null;
    return workspace.instance || null;
  }

  async findById(id: string): Promise<Workspace | null> {
    const result = await WorkspaceModel.findById(id);
    if (!result) return null;
    return this.instanceWorkspaceByReturnQuery(result);
  }

  private instanceWorkspaceByReturnQuery(workspace: WorkspaceModelType) {
    return new Workspace({
      id: workspace._id.toString(),
      name: workspace.name || "",
      status: workspace.status,
      instance: workspace.instance,
      jid: workspace.jid,
      phoneNumber: workspace.phoneNumber,
    });
  }
}
