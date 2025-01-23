import { Permission } from "node-appwrite";
import { db, commentCollection } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
  await databases.createCollection(db, commentCollection, commentCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.write("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);

  console.log("Comment collection created");

  await Promise.all([
    databases.createStringAttribute(
      db,
      commentCollection,
      "content",
      10000,
      true
    ),
    databases.createEnumAttribute(
      db,
      commentCollection,
      "type",
      ["question", "answer"],
      true
    ),
    databases.createStringAttribute(
      db,
      commentCollection,
      "authorId",
      50,
      true
    ),
    databases.createStringAttribute(db, commentCollection, "typeId", 50, true),
  ]);

  console.log("Comment collection attributes created");
}
