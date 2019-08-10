import App from './server';
const app = new App().express;
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server is listening on ${port}`)
});