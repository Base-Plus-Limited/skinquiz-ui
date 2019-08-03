"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var path_1 = require("path");
var app = express_1["default"]();
/*********************************
 * Setup
 *********************************/
var port = Number(process.env.PORT) || 3001;
app.use(express_1["default"].static(__dirname + '/build'));
app.use(express_1["default"].static(__dirname + '/build/static/'));
if (process.env.NODE_ENV === 'production') {
    app.get('/', function (req, res) {
        res.sendFile(path_1.join(__dirname, '/build', 'index.html'));
    });
    app.get('/download', function (req, res) {
        res.sendFile(path_1.join(__dirname, '/build', 'index.html'));
    });
}
app.listen(port, function () { return console.log("Server started on port " + port); });
process.on('uncaughtException', function (err) {
    console.log("ERROR: " + err.message);
});
/*********************************
 * Routes

app.get('/', (req: Request, res: Response) => {
  res.send('hello');
}) */ 
