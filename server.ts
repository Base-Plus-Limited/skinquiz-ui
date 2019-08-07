import express, { Application, Request, Response } from 'express';
import { join } from 'path';


const app: Application = express();


/*********************************
 * Setup
 *********************************/

const port: number = Number(process.env.PORT) || 3001;
app.use(express.static(__dirname + '/build'))
app.use(express.static(__dirname + '/build/static/'))

if (process.env.NODE_ENV === 'production') {
  app.get('/', (req: Request, res: Response) => {
    res.sendFile(join(__dirname, '/build', 'index.html')); 
  });
  app.get('/download', (req, res) => {
    res.sendFile(join(__dirname, '/build', 'index.html')); 
  });
}

app.listen(port, () => console.log(`Server started on port ${port}`));
process.on('uncaughtException', (err) => {
  console.log(`ERROR: ${err.message}`)
})


/*********************************
 * Routes
 ********************************/

app.get('/', (req: Request, res: Response) => {
  res.send('hello');
})