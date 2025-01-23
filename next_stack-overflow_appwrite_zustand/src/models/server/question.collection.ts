import sdk, { Permission, Databases } from "node-appwrite";
import { db, questionCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
  await databases.createCollection(db, questionCollection, questionCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.write("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  console.log("Question collection created");

  await Promise.all([
    databases.createStringAttribute(db, questionCollection, "title", 255, true),
    databases.createStringAttribute(
      db,
      questionCollection,
      "content",
      10000,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "authorId",
      50,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "tags",
      50,
      true,
      undefined,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "attachmentId",
      50,
      false
    ),
  ]);

  console.log("Question collection attributes created");

  // code for indexing but error , ,create manually if urgent
  // await Promise.all([
  //   databases.createIndex(
  //     db,
  //     questionCollection,
  //     "title",
  //     sdk.IndexType.FULLTEXT
  //   ),
  // ]);
}
