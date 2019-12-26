import express, { Application } from 'express';
import bodyParser, { json } from 'body-parser';
import dotenv from 'dotenv';
import { Html5Entities } from 'html-entities';
import { IWordpressQuestion } from './../react-ui/src/Interfaces/WordpressQuestion';
import { IIngredient, WordpressProduct } from './../react-ui/src/Interfaces/WordpressProduct';
import { IQuizQuestion } from './../react-ui/src/Interfaces/QuizQuestion';
import { ICompletedQuiz, IQuizData } from './../react-ui/src/Interfaces/CompletedQuiz';
import * as request from 'superagent';
import { resolve, join } from 'path';
import fs from 'fs';
import os from 'os';
import mongoose, {Document, Schema, model} from 'mongoose';
import { MongoError } from 'mongodb';
dotenv.config();

class App {
  public express: Application;
  private completedQuizModel = this.createCompletedQuizModel();

  constructor () {
    this.express = express();
    this.connectToDb();
    this.config(); 
    this.mountRoutes(); 
  }

  private skinTypeCodes: string[] = ["#F1EAE1", "#F6E4E3", "#F0D4CA", "#E2AE8D", "#9E633C", "#5E3C2B"];

  private config () {
    this.express.use(express.static(resolve(__dirname, '../react-ui/build')));
    this.express.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }

  private mountRoutes (): void {
    const router = express.Router();

    /*************************
     *  REDIRECT URL
     *************************/
    if (process.env.NODE_ENV === 'production') {
      this.express.get('/', (req, res) => {
        res.sendFile(resolve(__dirname, '../react-ui/build')); 
      });
    }
    
    /*************************
     *  SERVE API
     *************************/
    this.express.use('/api', bodyParser.json(), router);
    this.express.use('/quiz', bodyParser.json(), (req, res) => {
      res.sendFile(join(__dirname, '../react-ui/build', 'index.html'));
    });

    /*************************
     *  HEALTHCHECK
     *************************/
    router.get('/healthcheck', async (req, res) => {
      res.json({ message: "working" })
    });

    /*************************
     *  GET ALL QUESTIONS
     *************************/
    router.get('/questions', async (req, res) => {
      await request.get(`${process.env.BASE_API_URL}/wp/v2/diagnostic_tool`)
        .then(res => res.body)
        .then((questions: IWordpressQuestion[]) => questions.map(question => this.returnQuizQuestion(question)))
        .then(quiz => res.send(quiz))
        .catch((error) => res.status(error.status).send(this.handleError(error))) 
    });

    /*************************
     *  CREATE NEW PRODUCT
     *************************/
    router.post('/new-product', bodyParser.json(), async (req, res) => {
      await request.post(`https://baseplus.co.uk/wp-json/wc/v3/products?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`)
        .send(req.body)
        .then(productResponse => productResponse.body)
        .then((product: WordpressProduct) => res.json(product))
        .catch(error => console.log(error))
    });
      
    /*************************
     *  SAVE QUIZ ANSWERS TO DB
     *************************/
    router.post('/completed-quiz', bodyParser.json(), async (req, res) => {
      const quizData: IQuizData[] = req.body;
      const completedQuiz = new this.completedQuizModel({
        completedQuiz: {
          quizData
        }
      });
      completedQuiz.save()
        .then(dbResponse => res.json(dbResponse))
        .catch(error => res.send(error))
      // const quizAnswers: ICompletedQuiz[] = req.body;
      // const filename = join(__dirname, '../react-ui/src/Assets/', 'answeredQuestions.csv');
      // const output = [];
      // const trimmedDataHeadings = Object.keys(quizAnswers);
      // output.push(trimmedDataHeadings.join());
      // quizAnswers.forEach((field) => {
      //   const row = [];
      //   row.push(field.question);
      //   row.push(field.id);
      //   row.push(field.answer);

      //   output.push(row.join());
      // });
      // fs.writeFileSync(filename, output.join(os.EOL));
      // await request.get(`https://baseplus.co.uk/wp-json/wc/v3/products?WP_CONSUMER_KEY=${process.env.WP_CONSUMER_KEY}&WP_CONSUMER_SECRET=${process.env.WP_CONSUMER_SECRET}&category=21&type=composite&per_page=30`)
      //   .then(res => res.body)
      //   .then(products => {
      //     const trimmedData = products.map(response => {
      //       const { date_created, id, price } = response;
      //       return {
      //         date_created: new Date(date_created),
      //         id,
      //         price
      //       }
      //     });
      //     const filename = path.join(__dirname, '/src/assets/', 'productData.csv');
      //     const output = [];

      //     const trimmedDataHeadings = Object.keys(trimmedData[0]);
      //     output.push(trimmedDataHeadings.join()); // set headings

      //     trimmedData.forEach((field, index) => {
      //       const row = []; 
      //       row.push(field.date_created);
      //       row.push(field.id);
      //       row.push(field.price);

      //       output.push(row.join());
      //     });
      //     fs.writeFileSync(filename, output.join(os.EOL));
      //   })
      //   .then(fileUrl => res.end())
      //   .catch(error => res.status(400).send(error))
    });

    /*************************
     *  GET ALL INGREDIENTS
     *************************/
    router.get('/ingredients', async (req, res) => {
      await request.get(`${process.env.BASE_API_URL}/wc/v3/products?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}&category=35&type=simple&per_page=30`)
        .then(res => res.body)
        .then((ingredients: IIngredient[]) => ingredients.map(ingredient => {
          ingredient.rank = 0;
          ingredient.price_html = "";
          ingredient.description = ingredient.description.replace(/<[^>]*>?/gm, '');
          ingredient.short_description = ingredient.short_description.replace(/<[^>]*>?/gm, '');
          ingredient.previouslyRanked = false;
          return ingredient;
        }))
        .then((ingredients: IIngredient[]) => res.send(ingredients))
        .catch((error) => res.status(error.status).send(this.handleError(error)))
    });

    /*************************
     *  WILDCARD
     *************************/
    router.get('*', function (req, res) {
      res.sendFile(join(__dirname, '../react-ui/build', 'index.html'));
    });
  }

  private returnQuizQuestion(question: IWordpressQuestion): IQuizQuestion {
    const answerArr = question.content.rendered.replace(/<(?:.|\n)*?>/gm, '').split(',');
    const separatedMeta = question.excerpt.rendered.replace(/<(?:.|\n)*?>/gm, '').split('|');
    const entities = new Html5Entities();
    return {
      id: question.id,
      answered: false,
      prompt: question.prompt.includes("|") ? question.prompt.split("|") : question.prompt,
      isSkintoneQuestion: question.id === 716 && true, // skintone question
      isSkinConditionQuestion: question.id === 1443 && true, // skintone condition question
      customAnswer: "",
      displayAnswersAsADropdownOnMobile: answerArr.length > 5 && true,
      isMobilePanelOpen: false,
      isInputVisible: false,
      totalAnswersSelected: 0,
      question: entities.decode(question.title.rendered),
      answers: answerArr.map((answer, index) => {
        return {
          value: entities.decode(answer.trim()).includes("|") ? entities.decode(answer.trim()).split("|") : entities.decode(answer.trim()),
          selected: false,
          disable: false,
          id: answer.trim(),
          skinColour: question.id === 716 ? this.skinTypeCodes[index] : "",
          meta: separatedMeta.map(meta => meta.trim())
        }
      })
    }
  }

  private connectToDb() {
    mongoose.connect(`${process.env.DB_CONNECTION_STRING}`, { useNewUrlParser: true }, (err: MongoError) => {
      if(err)
        return console.log(`${err.code}, ${err.message}`);
      console.log("DB connection successful");
    });
  }

  private createCompletedQuizModel() {
    const CompletedQuizSchema = new Schema({
      completedQuiz: {
        id: {
          type: String,
          required: false,
          default: mongoose.Types.ObjectId
        },
        date: {
          type: Date,
          required: false,
          default: Date.now
        },
        quizData: [{
          questionId: {
            type: Number,
            required: true
          },
          answer: {
            type: String,
            required: true
          },
          question: {
            type: String,
            required: true
          }
        }]
      }
    })
    return model<ICompletedQuiz & Document>('CompletedQuiz', CompletedQuizSchema);
  }

  private handleError(error: any) {
    const response = JSON.parse(error.response.text);
    return {
      code: response.data.status,
      wordpressCode: response.code,
      info: response.message,
      error: true 
    }
  }
  
}

export default App;

