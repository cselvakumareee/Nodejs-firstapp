// import { MongoClient } from "mongodb";

// let _db: any;

// /**
//  * Connects to MongoDB and invokes the callback after initialization.
//  *
//  * @param callback - Function called once the database connection is ready.
//  */
// export const mongoConnect = (callback: Function) => {
//   const uri = "mongodb+srv://cselvakumareee_db_user:8FVP6mh7FYJ8bRHq@cluster0.1g9tmeq.mongodb.net/?appName=Cluster0";
//   const client = new MongoClient(uri);

//   client
//     .connect()
//     .then(() => {
//       console.log("MongoDB connected successfully");
//         _db = client.db();
//       callback();
//     })
//     .catch((err: any) => {
//       console.log("MongoDB connection error:", err);
//       throw err;
//     });
// };

// /** Returns the initialized MongoDB database handle. */
// const getDb = () => {
//   if (!_db) {
//     throw new Error("Database not initialized");
//   }
//     return _db;
// };

// export { getDb };
