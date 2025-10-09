const request = require("supertest");

const createNewUser = async () => {
  const newUser = {
    username: `julio_${Date.now()}`,
    password: "123456",
    favorecidos: ["priscila"],
  };
  
  await request("http://localhost:3000")
    .post("/users/register")
    .set("Content-Type", "application/json")
    .send(newUser);
  
  return newUser;
};

module.exports = {
  createNewUser,
};
