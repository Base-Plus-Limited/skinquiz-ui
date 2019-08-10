import express, { Application, Router } from 'express';

class Routes {
  public express: Application;
  public router: Router;

  constructor () {
    this.express = express();
    this.router = Router();
  }

  public getAllQuestions() {
    this.router.get("/", (req, res) => {
      res.json({ message: "sdsd" })
    })
  }

}

export default Routes;