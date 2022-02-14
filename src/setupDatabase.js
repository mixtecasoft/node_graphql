const OrientDBClient = require("orientjs").OrientDBClient;

const config = {
   host: "localhost",
   name: "Audionaut",
   user: "root",
   password: "admin",
};

const createClasses = async (db) => {
   let session = await db.acquire();

   await session.command("create class Media IF NOT EXISTS extends V").one();

   await session
      .command("create class S3MediaObject IF NOT EXISTS extends V")
      .one();

   await session
      .command("create class Transcription IF NOT EXISTS extends V")
      .one();

   await session
      .command("create class TaskScheduler IF NOT EXISTS extends V")
      .one();

   await session
      .command("create class Sentiment IF NOT EXISTS extends V")
      .one();

   await session.command("create class Entity IF NOT EXISTS extends V").one();

   await session
      .command("create class TranscriptHasEntities IF NOT EXISTS extends E")
      .one();

   //New classes were added to support the splitting of Transcriptions in sentences and sentences splitted into words.

   await session.command("create class Sentence IF NOT EXISTS extends E").one();

   await session.command("create class Word IF NOT EXISTS extends E").one();

   await session.close();
};

const createEdges = async (db) => {
   let session = await db.acquire();

   await session
      .command("create class TranscriptHasEntities IF NOT EXISTS extends E")
      .one();

   //New edges

   await session
      .command("create class SentenceHasWords IF NOT EXISTS extends E")
      .one();

   await session
      .command("create class TranscriptHasSentences IF NOT EXISTS extends E")
      .one();

   await session.close();
};

const setupDatabase = async () => {
   let client = await OrientDBClient.connect({
      host: config.host,
      pool: {
         max: 10,
      },
   });

   console.log("OrientDB connected successfully 🚀 ");

   let exists = await client.existsDatabase({
      name: config.name,
      username: config.user,
      password: config.password,
   });

   if (!exists) {
      await client.createDatabase({
         name: config.name,
         username: config.user,
         password: config.password,
      });
   }

   let pool = await client.sessions({
      name: config.name,
      username: config.user,
      password: config.password,
      pool: {
         max: 25,
      },
   });

   if (true) {
      createClasses(pool);
      createEdges(pool);
   }

   return pool;
};

module.exports = setupDatabase;
