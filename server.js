"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
var html_entities_1 = require("html-entities");
var request = __importStar(require("superagent"));
dotenv_1["default"].config();
var App = /** @class */ (function () {
    function App() {
        this.express = express_1["default"]();
        this.mountRoutes();
    }
    App.prototype.mountRoutes = function () {
        var _this = this;
        var router = express_1["default"].Router();
        this.express.use('/', router);
        this.express.use(body_parser_1["default"].json());
        /*************************
         *  GET ALL QUESTIONS
         *************************/
        router.get('/quiz', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request.get(process.env.BASE_API_URL + "/wp/v2/diagnostic_tool?consumer_key=" + process.env.CONSUMER_KEY + "&consumer_secret=" + process.env.CONSUMER_SECRET)
                            .then(function (res) { return res.body; })
                            .then(function (questions) { return questions.map(function (question) {
                            return _this.returnQuizQuestion(question);
                        }); })
                            .then(function (quiz) { return res.send(JSON.stringify(quiz)); })["catch"](function (error) { return res.json({ error: error.message }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        /*************************
         *  GET ALL INGREDIENTS
         *************************/
        router.get('/ingredients', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request.get(process.env.BASE_API_URL + "/wc/v3/products?consumer_key=" + process.env.CONSUMER_KEY + "&consumer_secret=" + process.env.CONSUMER_SECRET + "&category=35&type=simple&per_page=30")
                            .then(function (res) { return res.body; })
                            .then(function (ingredients) { return ingredients.map(function (ingredient) {
                            ingredient.rank = 0;
                            return ingredient;
                        }); })
                            .then(function (ingredients) { return res.send(JSON.stringify(ingredients)); })["catch"](function (error) { return res.json({ error: error.message }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    App.prototype.returnQuizQuestion = function (question) {
        var entities = new html_entities_1.Html5Entities();
        var answerArr = question.content.rendered.replace(/<(?:.|\n)*?>/gm, '').split(',');
        var separatedMeta = question.excerpt.rendered.replace(/<(?:.|\n)*?>/gm, '').split('|');
        return {
            id: question.id,
            answered: false,
            hide: true,
            question: entities.decode(question.title.rendered),
            answers: answerArr.map(function (answer) {
                return {
                    value: entities.decode(answer.trim()),
                    selected: false,
                    id: answer.trim(),
                    meta: separatedMeta.map(function (meta) { return meta.trim(); })
                };
            })
        };
    };
    return App;
}());
exports["default"] = App;
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
