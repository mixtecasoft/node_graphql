const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 4000;
const OrientDBClient = require("orientjs").OrientDBClient;

const startLiveQuery = async (pool) => {
   let session = await pool.acquire();

   session.liveQuery(`select from Room`).on("data", (msg) => {
      // inserted record op = 1
      if (msg.operation === 1) {
         io.emit("chat message", msg.data);
      }
   });
   await session.close();
};

const listenForMessage = (pool) => {
   io.on("connection", function (socket) {
      socket.on("chat message", async (msg) => {
         let session = await pool.acquire();
         try {
            session
               .command(
                  `insert into Room set text = :text, date = sysdate(), author = :author`,
                  { params: msg }
               )
               .one();
         } catch (err) {
            console.log(err);
         }
         await session.close();
      });
   });
};
const boostrap = ({ client, pool }) => {
   startLiveQuery(pool);
   listenForMessage(pool);

   app.use(async (req, res, next) => {
      try {
         let session = await pool.acquire();
         res.locals.db = session;
         res.on("finish", async () => {
            await session.close();
         });
         next();
      } catch (err) {
         res.status(500).send(err);
      }
   });
   app.get("/", function (req, res) {
      res.sendFile(__dirname + "/index.html");
   });

   app.get("/messages", async (req, res) => {
      try {
         let messages = await res.locals.db
            .query("select from Room order by date limit 20")
            .all();
         res.send(messages);
      } catch (err) {
         res.status(500).send(err);
      }
   });

   http.listen(port, function () {
      console.log("listening on *:" + port);
   });
};

run();
