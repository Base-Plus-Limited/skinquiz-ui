import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Html5Entities } from 'html-entities';
import { IWordpressQuestion } from './../react-ui/src/Interfaces/WordpressQuestion';
import { IIngredient, ISerum, WordpressMetaData, WordpressProduct } from './../react-ui/src/Interfaces/WordpressProduct';
import { IAnalyticsEvent } from './../react-ui/src/Interfaces/Analytics';
import { IQuizQuestion } from './../react-ui/src/Interfaces/QuizQuestion';
import { IHoneyBadgerErrorTypes } from './../react-ui/src/Interfaces/ErrorTypes';
import { ICompletedQuizDBModel } from './../react-ui/src/Interfaces/CompletedQuizDBModel';
import ICustomProductDBModel from './../react-ui/src/Interfaces/CustomProduct';
import ISerumQuizDBModel from './../react-ui/src/Interfaces/SerumQuizDBModel';
import { ICompletedQuiz } from './../react-ui/src/Interfaces/CompletedQuiz';
import * as request from 'superagent';
import * as mixpanel from 'mixpanel';
import { resolve, join } from 'path';
import fs from 'fs';
import os from 'os';
import mongoose, { Document, Schema, model } from 'mongoose';
import honeybadger from 'honeybadger';
dotenv.config();

const enum QuestionType {
  Fragrance = 3870,
  SkinCondition = 1443,
  SerumSkinCondition = 5366,
  Skintone = 716,
  SerumSkintone = 5365
}

const enum MetaData {
  CommonlyUsedFor = "commonly_used_for"
}

const enum FreeGiftSerum {
  Id = 6039
}

class App {
  public express: Application;
  private completedQuizModel = this.createCompletedQuizModel();
  private customProductModel = this.createCustomProductModel();
  private completedSerumQuizModel = this.createCompletedSerumQuizModel();
  private mixPanelClient = mixpanel.init(`${process.env.MOISTURISER_MIXPANEL_ID}`);
  private serumMixPanelClient = mixpanel.init(`${process.env.SERUM_MIXPANEL_ID}`);
  private newFileName = "";

  constructor () {
    this.express = express();
    this.configureHoneyBadger();
    this.config(); 
    this.mountRoutes(); 
    this.connectToDb();
  }

  private skinRangeColours: { [key: string]: string[] } = {
    "0" : ["#CF9D72", "#E2B18A", "#EDBFA0", "#EECDB2", "#EEDDCC"],
    "1" : ["#CF8A86", "#DF9A96", "#E3ADA6", "#F1BEB6", "#ECCEC9"],
    "2" : ["#B38371", "#CE9E8A", "#E4B59C", "#F0C4AF", "#F2D7C9"],
    "3" : ["#906D5A", "#9C7860", "#B59179", "#CFA995", "#DABCAB"],
    "4" : ["#884C1C", "#965823", "#A86B2F", "#B27941", "#C18352"],
    "5" : ["#4C0C00", "#581503", "#711F13", "#7A3724", "#914C3D"],
  }

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
     *  GET ALL MOISTURISER QUESTIONS
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
          const quizzes: ICompletedQuiz[] = dbResponse.map(x => x.toJSON());
          const date = new Date(quizzes[quizzes.length - 1].date).toLocaleString();
          const fileName = `completed-quiz-${this.generateRandomString()}.csv`;
          const valuesForDashboard = {
            totalQuizItems: quizzes.length,
            latestQuizDate: date,
            fileName
          }
          this.newFileName = fileName;
          res.send(valuesForDashboard);
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
      const uiRequest: ICompletedQuizDBModel = req.body;
      const completedQuiz = new this.completedQuizModel({
        quiz: uiRequest.quiz,
        productId: uiRequest.productId,
        date: this.getGmtTime(),
      });
      completedQuiz.save()
        .then(dbResponse => {
          console.log(`Saved completed quiz with id ${dbResponse.id}`);
          res.send(dbResponse);
        })
        .catch(error => {
          honeybadger.notify(`Error saving quiz: ${error}`, IHoneyBadgerErrorTypes.DATABASE);
          if (error.name === "ValidationError") {
            res.status(400).send({message:error.message});
            return;
          }
          res.send(error);
        })
    });

    /*************************
     *  SAVE PRODUCTS TO DB
     *************************/
    router.post('/save-product', bodyParser.json(), async (req, res) => {
      const customProductRequest: ICustomProductDBModel = req.body;
      const customProduct = new this.customProductModel({
        recommendedVariation: customProductRequest.recommendedVariation,
        amended: customProductRequest.amended,
        productId: customProductRequest.productId,
        newVariation: customProductRequest.newVariation,
        date: this.getGmtTime()
      });
      customProduct.save()
      .then(dbResponse => {
          console.log(`Saved custom product with id ${dbResponse.id}`);
          res.send(dbResponse);
        })
        .catch(error => {
          honeybadger.notify(`Error saving product: ${error.message}`, IHoneyBadgerErrorTypes.DATABASE);
          if (error.name === "ValidationError") {
            res.status(400).send({message:error.message});
            return;
          }
          res.send(error);
        })
    });

    /*************************
     *  GET ALL INGREDIENTS
     *************************/
    router.get('/ingredients', async (req, res) => {
      await request.get(`${process.env.BASE_API_URL}/wc/v3/products?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}&category=35&type=simple&per_page=30`)
        .then(res => res.body)
        .then((ingredients: IIngredient[]) => ingredients.map(ingredient => {
          const foundMetaData = ingredient.meta_data.find(meta => meta.key === MetaData.CommonlyUsedFor);
          ingredient.rank = 0;
          ingredient.commonlyUsedFor = foundMetaData ? foundMetaData.value.split(",") : [];
          ingredient.price_html = "";
          ingredient.description = ingredient.description.replace(/<[^>]*>?/gm, '');
          ingredient.short_description = ingredient.short_description.replace(/<[^>]*>?/gm, '');
          ingredient.previouslyRanked = false;
          ingredient.isSelectedForSummary = false;
          ingredient.isDescriptionPanelOpen = false;
          ingredient.showDescription = false;
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
     *  GET ALL SERUMS / TEMP, THIS SHOULD BE ON IT'S OWN SERVER
     *************************/
    router.get('/serums', async (req, res) => {
      await request.get(`${process.env.BASE_API_URL}/wc/v3/products?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}&category=93&type=simple`)
        .then(res => res.body)
        .then((serums: ISerum[]) => serums.map(serum => {
          serum.commonlyUsedFor = [];
          serum.isSelectedForSummary = false;
          serum.short_description = serum.short_description.replace(/<[^>]*>?/gm, '');
          serum.description = serum.description.replace(/<[^>]*>?/gm, '');
          serum.isDescriptionPanelOpen = false;
          return serum;
        }))
        .then((serums: ISerum[]) => res.send(serums.filter(serum => serum.id !== FreeGiftSerum.Id)))
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
     *  GET ALL SERUM QUESTIONS / TEMP, THIS SHOULD BE ON IT'S OWN SERVER
     *************************/
    router.get('/serum-quiz', async (req, res) => {
      await request.get(`${process.env.BASE_API_URL}/wp/v2/serum_quiz`)
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
     *  SAVE SERUM QUIZ TO DB / TEMP, THIS SHOULD BE ON IT'S OWN SERVER
     *************************/
    router.post('/save-serum-quiz', bodyParser.json(), async (req, res) => {
      const serumRequest: ISerumQuizDBModel = req.body;
      const serumData = new this.completedSerumQuizModel({
        selectedSerum: serumRequest.selectedSerum,
        selectedSerumId: serumRequest.selectedSerumId,
        recommendedSerum: serumRequest.recommendedSerum,
        recommendedSerumId: serumRequest.recommendedSerumId,
        quiz: serumRequest.quiz,
        quizId: serumRequest.quizId,
        date: this.getGmtTime()
      });
      serumData.save()
        .then(dbResponse => {
          console.log(`Saved serum data with id ${dbResponse.id}`);
          res.send(dbResponse);
        })
        .catch(error => {
          honeybadger.notify(`Error saving product: ${error.message}`, IHoneyBadgerErrorTypes.DATABASE);
          if (error.name === "ValidationError") {
            res.status(400).send({message:error.message});
            return;
          }
          res.send(error);
        })
    });

    /*************************
     *  UPDATE SERUM META DATA WITH QUIZ ID / TEMP, THIS SHOULD BE ON IT'S OWN SERVER
     *************************/
    router.post('/update-serum-meta-data', bodyParser.json(), async (req, res) => {
      const { selectedSerumId, quizIdsMeta }: { selectedSerumId: number, quizIdsMeta: WordpressMetaData } = req.body;
      if ((selectedSerumId === undefined) || (quizIdsMeta === undefined)) {
        honeybadger.notify("One of the parameters 'selectedSerumId' or 'quizIds' is undefined", IHoneyBadgerErrorTypes.APIREQUEST);
        res.status(400).send({ message: "selectedSerumId or quizIds is undefined" });
        return;
      }
      await request.patch(`${process.env.BASE_API_URL}/wc/v3/products/${selectedSerumId}?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`)
        .send({ meta_data: [quizIdsMeta] })
        .then(response => response.body)
        .then((updatedSerum: WordpressProduct) => res.send(updatedSerum))
        .catch((error) => {
          honeybadger.notify(`Error ${this.handleError(error).code}, ${this.handleError(error).message}`, IHoneyBadgerErrorTypes.APIREQUEST);
          res.status(error.status).send(this.handleError(error));
        }) 
    });

    /*************************
     *  LOG SERUM ANALYTICS
     *************************/
    router.post('/serum-analytics', (req, res) => {
      const data: IAnalyticsEvent = req.body;
      const {distinct_id, question_id, event_type } = data;
      this.serumMixPanelClient.track(event_type, {
        distinct_id,
        question_id
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
     *  WILDCARD
     *************************/
    router.get('*', function (req, res) {
      res.sendFile(join(__dirname, '../react-ui/build', 'index.html'));
    });
  }

  private generateRandomString = () => {
    return Math.random().toString().split('.')[1].slice(0,5);
  }

  private getGmtTime = () => {
    const utc = new Date();
    return utc.setHours( utc.getHours() + 1);
  }

  private writeDbDataTOCSV = (dbData: (ICompletedQuizDBModel & mongoose.Document)[]) => {
    const newFileNameFilePath = join(__dirname, '../react-ui/src/Assets/', `${this.newFileName}`);
    if (dbData.length > 0) {
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
      fs.writeFileSync(newFileNameFilePath, output.join(os.EOL));
      console.log('has a new file been written?', fs.existsSync(newFileNameFilePath));
      var updatedStats = fs.statSync(newFileNameFilePath);
      console.log('new file name', newFileNameFilePath);   
      console.log('paths in folder', fs.readdirSync(join(__dirname, '../react-ui/src/Assets/')));
      console.log('new file size', updatedStats["size"] / 1000000.0);   
    }
  }

  private returnQuizQuestion(question: IWordpressQuestion): IQuizQuestion {
    const answerArr = question.content.rendered.replace(/<(?:.|\n)*?>/gm, '').split(',');
    const separatedMeta = question.excerpt.rendered.replace(/<(?:.|\n)*?>/gm, '').split('|');
    const entities = new Html5Entities();
    return {
      id: question.id,
      answered: false,
      prompt: question.prompt.includes("|") ? question.prompt.split("|") : question.prompt,
      isSkintoneQuestion: (question.id === QuestionType.Skintone || question.id === QuestionType.SerumSkintone) ? true : false, 
      isSkinConditionQuestion: (question.id === QuestionType.SerumSkinCondition || question.id === QuestionType.SkinCondition) ? true : false, 
      customAnswer: "",
      displayAnswersAsADropdownOnMobile: answerArr.length > 5 && true,
      isMobilePanelOpen: false,
      isInputVisible: false,
      isFullScreen: question.id === QuestionType.Fragrance && true,
      totalAnswersSelected: 0,
      question: entities.decode(question.title.rendered),
      answers: answerArr.map((answer, index) => {
        return {
          value: entities.decode(answer.trim()).includes("|") ? entities.decode(answer.trim()).split("|") : entities.decode(answer.trim()),
          selected: false,
          disable: false,
          id: answer.trim(),
          skinColours: (question.id === QuestionType.SerumSkintone || question.id === QuestionType.Skintone) ? this.skinRangeColours[index] : [],
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
      date: {
        type: Date,
        required: false,
        default: Date.now
      },
      productId: {
        type: Number,
        required: true
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

  private createCompletedSerumQuizModel() {
    const SerumQuizSchema = new Schema({
      quizId: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        required: false,
        default: Date.now
      },
      selectedSerum: {
        type: String,
        required: true
      },
      selectedSerumId: {
        type: Number,
        required: true
      },
      recommendedSerum: {
        type: String,
        required: true
      },
      recommendedSerumId: {
        type: Number,
        required: true
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
    return model<ISerumQuizDBModel & Document>('completed-serum-quizzes', SerumQuizSchema);
  }

  private createCustomProductModel() {
    const CustomProductSchema = new Schema({
      productId: {
        type: Number,
        required: true
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
      newVariation: {
        type: Object,
        required: false
      },
      recommendedVariation: {
        type: Object,
        required: true
      },
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

