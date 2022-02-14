const startLiveQuery = async (pool) => {
   let session = await pool.acquire();
   session.liveQuery("select from V").on("data", (data) => {
      console.log(data);
   });

   await session.close();
};

module.exports = startLiveQuery;
