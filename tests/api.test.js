import supertest from "supertest";
import { expect } from "chai";
import { userAszton, asztonUdid } from "../data/users.js";

const BASE_URL = "https://demoqa.com";
let bearerToken;

describe("API tests", () => {
  it("Get all books and verify author and title of the first book", (done) => {
    supertest(BASE_URL)
      .get("/BookStore/v1/Books")
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        expect(res.body.books[0].author).to.eql("Richard E. Silverman");
        expect(res.body.books[0].title).to.eql("Git Pocket Guide");
        return done();
      });
  });

  it("Login to the app and generate token", (done) => {
    supertest(BASE_URL)
      .post("/Account/v1/GenerateToken")
      .send(userAszton)
      .set("Accept", "application/json")
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        expect(res.body.status).to.eql("Success");
        expect(res.body.result).to.eql("User authorized successfully.");
        expect(res.body.token).to.not.be.empty;
        bearerToken = res.body.token;
        return done();
      });
  });

  it("Get user data and load token", (done) => {
    supertest(BASE_URL)
      .get(`/Account/v1/User/${asztonUdid}`)
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        expect(res.body.username).to.eql("Aszton");
        expect(res.body.books).to.be.an("array");
        return done();
      });
  });
});
