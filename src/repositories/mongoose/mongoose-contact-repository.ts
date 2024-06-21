import {
  ContactSchemaType,
  mongoose,
  Contact as ContactModel,
} from "mongoose-models";
import { Contact } from "../../entities/contact";
import {
  ContactRepository,
  FindContactsToVerifyResponse,
  UpdateWppInfoParams,
} from "../abstract/contact-repository";

interface ContactModelType extends ContactSchemaType, mongoose.Document {}

export class MongooseContactRepository implements ContactRepository {
  async findById(contactId: string): Promise<Contact | null> {
    const result = await ContactModel.findById(contactId);
    if (!result) return null;
    return this.instanceContactByReturnQuery(result);
  }

  async updateWppInfo(id: string, args: UpdateWppInfoParams): Promise<void> {
    const updateQuery: Record<string, unknown> = {
      verified: true,
      verifiedAt: new Date(),
      onWhatsapp: args.onWhatsapp,
    };
    if (args.jid) updateQuery["jid"] = args.jid;
    if (args.phoneNumber) updateQuery["phoneNumber"] = args.phoneNumber;
    await ContactModel.findByIdAndUpdate(id, {
      $set: updateQuery,
      $inc: {
        verifyAttempts: 1,
      },
    });
  }

  async incrementAttempts(id: string): Promise<void> {
    await ContactModel.findByIdAndUpdate(id, {
      $inc: {
        verifyAttempts: 1,
      },
    });
  }

  async findContactsToVerify(
    limit: number
  ): Promise<FindContactsToVerifyResponse> {
    const result = await ContactModel.find({
      verified: false,
      verifyAttempts: {
        $lt: 3,
      },
    })
      .sort({
        verifiedAt: 1,
      })
      .limit(limit);
    return result.map((contact) => ({
      id: contact.id,
      workspaceId: contact.workspaceId as string,
    }));
  }

  private instanceContactByReturnQuery(contact: ContactModelType) {
    return new Contact({
      id: contact.id || "",
      name: contact.name || "",
      phoneNumber: contact.phoneNumber || "",
      jid: contact.jid,
      workspaceId: contact.workspaceId || "",
      email: contact.email,
      createdAt: contact.createdAt,
    });
  }
}
