import App from './server';
const app = new App().express;
const port = process.env.PORT||3001;
app.listen(port, () => {
  process.stdout.write(`server is listening on ${port}`)
});
process.on('uncaughtException', (err) => {
  process.stderr.write(`ERROR: ${err.message}`)
})