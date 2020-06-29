import express, { Application } from 'express';
import bodyParser, { json } from 'body-parser';
import dotenv from 'dotenv';
import { Html5Entities } from 'html-entities';
import { IWordpressQuestion } from './../react-ui/src/Interfaces/WordpressQuestion';
import { IIngredient, WordpressProduct } from './../react-ui/src/Interfaces/WordpressProduct';
import { IAnalyticsEvent } from './../react-ui/src/Interfaces/Analytics';
import { IQuizQuestion } from './../react-ui/src/Interfaces/QuizQuestion';
import { IHoneyBadgerErrorTypes } from './../react-ui/src/Interfaces/ErrorTypes';
import { ICompletedQuizDBModel, IQuizData } from './../react-ui/src/Interfaces/CompletedQuizDBModel';
import ICustomProductDBModel from './../react-ui/src/Interfaces/CustomProduct';
import { ICompletedQuiz } from './../react-ui/src/Interfaces/CompletedQuiz';
import * as request from 'superagent';
import * as mixpanel from 'mixpanel';
import { resolve, join } from 'path';
import fs from 'fs';
import os from 'os';
import mongoose, { Document, Schema, model } from 'mongoose';
import { MongoError } from 'mongodb';
import honeybadger from 'honeybadger';
dotenv.config();

class App {
  public express: Application;
  private completedQuizModel = this.createCompletedQuizModel();
  private customProductModel = this.createCustomProductModel();
  private mixPanelClient = mixpanel.init(`${process.env.MIXPANEL_ID}`);

  constructor () {
    this.express = express();
    this.configureHoneyBadger();
    this.config(); 
    this.mountRoutes(); 
    this.connectToDb();
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

  private configureHoneyBadger () {
    honeybadger.configure({
      apiKey: `${process.env.HONEYBADGER_API_KEY}`
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
     *  SERVE ROUTES
     *************************/
    this.express.use(honeybadger.requestHandler);
    this.express.use('/api', bodyParser.json(), router);
    this.express.use('/quiz', bodyParser.json(), (req, res) => {
      res.sendFile(join(__dirname, '../react-ui/build', 'index.html'));
    });
    this.express.use('/download-data', bodyParser.json(), (req, res) => {
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
        .catch((error) => {
          if(error instanceof TypeError) {
            honeybadger.notify(`${error.name}: ${error.message}`, IHoneyBadgerErrorTypes.CODE);
            res.status(500).end();
            return;
          }
          honeybadger.notify(`Error ${this.handleError(error).code}, ${this.handleError(error).message}`, IHoneyBadgerErrorTypes.APIREQUEST);
          res.status(error.status).send(this.handleError(error));
        }) 
    });

    /*************************
     *  CREATE NEW PRODUCT
     *************************/
    router.post('/new-product', bodyParser.json(), async (req, res) => {
      await request.post(`${process.env.BASE_API_URL}/wc/v3/products?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`)
        .send(req.body)
        .then(productResponse => productResponse.body)
        .then((product: WordpressProduct) => res.send(product))
        .catch((error) => {
          honeybadger.notify(`Error ${this.handleError(error).code}, ${this.handleError(error).message}`, IHoneyBadgerErrorTypes.APIREQUEST);
          res.status(error.status).send(this.handleError(error));
        }) 
    });

    /*************************
     *  GET COMPLETED QUIZ ANSWERS
     *************************/
    router.get('/completed-quiz', async (req, res) => {
      this.completedQuizModel.find()
        .then(dbResponse => {
          res.send(dbResponse);
          this.writeDbDataTOCSV(dbResponse);
        })
        .catch(error => {
          honeybadger.notify(`Error retrieving completed quizzes: ${error.message}`, IHoneyBadgerErrorTypes.DATABASE);
          res.send(error);
        })
    });

    /*************************
     *  LOG ANALYTICS
     *************************/
    router.post('/analytics', (req, res) => {
      const data: IAnalyticsEvent = req.body;
      const {distinct_id, question_id, ingredients, event_type } = data;
      this.mixPanelClient.track(event_type, {
        distinct_id,
        question_id,
        ingredients
      }, (response) => {
        if(response instanceof Error) {
          res.send(response);
          honeybadger.notify(`Error logging analytics: ${response.message}`, IHoneyBadgerErrorTypes.ANALYTICS)
          return;
        }
        res.send(response);
        console.log(`Logged analytics event ${data.event_type}`);
      })
    });
    
    /*************************
     *  SAVE QUIZ ANSWERS TO DB
     *************************/
  router.post('/save-quiz', bodyParser.json(), async (req, res) => {
      const quiz: IQuizData[] = req.body;
      const completedQuiz = new this.completedQuizModel({
        quiz,
        date: this.getGmtTime()
      });
      completedQuiz.save()
        .then(dbResponse => {
          console.log(`Saved completed quiz with id ${dbResponse.id}`);
          res.json(dbResponse)
        })
        .catch(error => {
          honeybadger.notify(`Error saving quiz: ${error}`, IHoneyBadgerErrorTypes.DATABASE);
          res.send(error);
        })
    });

    /*************************
     *  SAVE PRODUCTS TO DB
     *************************/
    router.post('/save-product', bodyParser.json(), async (req, res) => {
      const customProductRequest: ICustomProductDBModel = req.body;
      const customProduct = new this.customProductModel({
        ingredients: customProductRequest.ingredients,
        amended: customProductRequest.amended,
        date: this.getGmtTime()
      });
      customProduct.save()
        .then(dbResponse => {
          console.log(`Saved custom product with id ${dbResponse.id}`);
          res.end();
        })
        .catch(error => {
          honeybadger.notify(`Error saving product: ${error.message}`, IHoneyBadgerErrorTypes.DATABASE);
          res.end();
        })
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
          ingredient.isSelectedForSummary = false;
          return ingredient;
        }))
        .then((ingredients: IIngredient[]) => res.send(ingredients))
        .catch((error) => {
          if(error instanceof TypeError) {
            honeybadger.notify(`${error.name}: ${error.message}`, IHoneyBadgerErrorTypes.CODE);
            res.status(500).end();
            return;
          }
          honeybadger.notify(`Error ${this.handleError(error).code}, ${this.handleError(error).message}`);
          res.status(error.status).send(this.handleError(error));
        }) 
    });

    /*************************
     *  WILDCARD
     *************************/
    router.get('*', function (req, res) {
      res.sendFile(join(__dirname, '../react-ui/build', 'index.html'));
    });
  }

  private getGmtTime = () => {
    const utc = new Date();
    return utc.setHours( utc.getHours() + 1);
  }

  private writeDbDataTOCSV = (dbData: (ICompletedQuizDBModel & mongoose.Document)[]) => {
    const filename = join(__dirname, '../react-ui/src/Assets/', 'completedQuizData.csv');
    if (fs.existsSync(filename)) {
      var stats = fs.statSync(filename);
      console.log('current file size', stats["size"] / 1000000.0);   
      console.log('deleting file...');   
      fs.unlinkSync(filename);  
      console.log('does file exist?', fs.existsSync(filename));
    }

    const output: string[] = [];
    var dbDataAsObject:ICompletedQuiz = dbData[0].toObject();
    const dataHeadings = ["id","date", ...Object.values(dbDataAsObject.quiz.map(quiz => {
      if(quiz.question.includes(','))
        return quiz.question.split(',').join('-');
      return quiz.question
    }))];
    output.push(dataHeadings.join());
    dbData.forEach((dbEntry) => {
      const row = [];
      const JSDbObject: ICompletedQuiz = dbEntry.toObject();
      const quizDate = new Date(JSDbObject.date);
      row.push(JSDbObject.id, `${quizDate.getDate()}/${quizDate.getMonth() + 1}/${quizDate.getFullYear()}`,...JSDbObject.quiz.map(quiz => {
        if (quiz.answer.includes(','))
          return quiz.answer.split(',').join(' - ');
        return quiz.answer;
      }));
      output.push(row.join());
    });
    fs.writeFileSync(filename, output.join(os.EOL));
    console.log('has a new file been written?', fs.existsSync(filename));
    var updatedStats = fs.statSync(filename);
    console.log('new file size', updatedStats["size"] / 1000000.0);   
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
      isFullScreen: false,
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
    mongoose.connect(`${process.env.DB_CONNECTION_STRING}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(_ => {
      console.log("Db connection successful");
      this.listenForErrorsAfterConnection();
    })
    .catch(error => {
      honeybadger.notify(`Database connection error: ${error.message}`, IHoneyBadgerErrorTypes.DATABASE)
    });
  }

  private listenForErrorsAfterConnection() {
    mongoose.connection.on('error', err => {
      honeybadger.notify(err.message, IHoneyBadgerErrorTypes.DATABASE);
    });
  }

  private createCompletedQuizModel() {
    const CompletedQuizSchema = new Schema({
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
      quiz: [{
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
    })
    return model<ICompletedQuizDBModel & Document>('completed-quizzes', CompletedQuizSchema);
  }

  private createCustomProductModel() {
    const CustomProductSchema = new Schema({
      id: {
        type: String,
        required: false,
        default: mongoose.Types.ObjectId
      },
      amended: {
        type: Boolean,
        required: true,
        default: false
      },
      date: {
        type: Date,
        required: false,
        default: Date.now
      },
      ingredients: [{
        id: {
          type: Number,
          required: true
        },
        name: {
          type: String,
          required: true
        }
      }]
    })
    return model<ICustomProductDBModel & Document>('custom-products', CustomProductSchema);
  }

  private handleError(error: any) {
    const response = JSON.parse(error.response.text);
    return {
      code: response.data.status,
      wordpressCode: response.code,
      message: response.message,
      error: true
    }
  }
  
}

export default App;

