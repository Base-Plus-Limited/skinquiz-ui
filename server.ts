import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Html5Entities } from 'html-entities';
import { IWordpressQuestion } from './src/Interfaces/WordpressQuestion';
import { IIngredient } from './src/Interfaces/WordpressProduct';
import { IQuizQuestion } from './src/Interfaces/QuizQuestion';
import * as request from 'superagent';
dotenv.config();

class App {
  public express: Application;

  constructor () {
    this.express = express();
    this.mountRoutes(); 
  }

  private mountRoutes (): void {
    const router = express.Router();
    this.express.use('/', router);
    this.express.use(bodyParser.json());


    /*************************
     *  GET ALL QUESTIONS
     *************************/
    router.get('/quiz', async (req, res) => {
      await request.get(`${process.env.BASE_API_URL}/wp/v2/diagnostic_tool?consumer_key=${process.env.CONSUMER_KEY}&consumer_secret=${process.env.CONSUMER_SECRET}`)
        .then(res => res.body)
        .then((questions: IWordpressQuestion[]) => questions.map(question => {
          return this.returnQuizQuestion(question);
        }))
        .then(quiz => res.send(JSON.stringify(quiz)))
        .catch((error: Error) => res.json({ error: error.message }))
    });


    /*************************
     *  GET ALL INGREDIENTS
     *************************/
    router.get('/ingredients', async (req, res) => {
      await request.get(`${process.env.BASE_API_URL}/wc/v3/products?consumer_key=${process.env.CONSUMER_KEY}&consumer_secret=${process.env.CONSUMER_SECRET}&category=35&type=simple&per_page=30`)
        .then(res => res.body)
        .then((ingredients: IIngredient[]) => ingredients.map(ingredient => {
          ingredient.rank = 0;
          return ingredient;
        }))
        .then((ingredients: IIngredient[]) => res.send(JSON.stringify(ingredients)))
        .catch((error: Error) => res.json({ error: error.message }))
    });

  }

  private returnQuizQuestion(question: IWordpressQuestion): IQuizQuestion {
    const entities = new Html5Entities();
    const answerArr = question.content.rendered.replace(/<(?:.|\n)*?>/gm, '').split(',');
    const separatedMeta = question.excerpt.rendered.replace(/<(?:.|\n)*?>/gm, '').split('|');
    return {
      id: question.id,
      answered: false,
      hide: true,
      question: entities.decode(question.title.rendered),
      answers: answerArr.map(answer => {
        return {
          value: entities.decode(answer.trim()),
          selected: false,
          id: answer.trim(),
          meta: separatedMeta.map(meta => meta.trim())
        }
      })
    }
  }
}

export default App;

// export default class App {

//   private app: Application;
//   private port: number;
//   private router = new Routes();

//   constructor() {
//     this.port = Number(process.env.PORT) || 3001;
//     this.app = express();
//     this.config();
//     this.initialiseRoutes();
//   }
  
//   private config() {
//     this.app.use(express.static(__dirname + '/build'))
//     this.app.use(express.static(__dirname + '/build/static/'))

//     if (process.env.NODE_ENV === 'production') {
//       this.app.get('/', (req: Request, res: Response) => {
//         res.sendFile(join(__dirname, '/build', 'index.html')); 
//       });
//       this.app.get('/download', (req, res) => {
//         res.sendFile(join(__dirname, '/build', 'index.html')); 
//       });
//     }

//     this.app.listen(this.port, () => console.log(`Server started on port ${this.port}`));
//     process.on('uncaughtException', (err) => {
//       console.log(`ERROR: ${err.message}`)
//     })

//   }
