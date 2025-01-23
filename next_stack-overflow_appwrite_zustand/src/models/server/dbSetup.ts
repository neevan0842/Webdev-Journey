import { db } from "../name";
import createAnswerCollection from "./answers.collection";
import createCommentCollection from "./comment.collection";
import { databases } from "./config";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log("Database Connected");
  } catch (error: any) {
    try {
      await databases.create(db, db);
      console.log("Database Created");

      await Promise.all([
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
        createQuestionCollection(),
      ]);

      console.log("Database Setup Completed");
    } catch (error: any) {
      console.log(error);
    }
  }

  return databases;
}
