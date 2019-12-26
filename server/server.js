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
var path_1 = require("path");
var mongoose_1 = __importStar(require("mongoose"));
dotenv_1["default"].config();
var App = /** @class */ (function () {
    function App() {
        this.completedQuizModel = this.createCompletedQuizModel();
        this.skinTypeCodes = ["#F1EAE1", "#F6E4E3", "#F0D4CA", "#E2AE8D", "#9E633C", "#5E3C2B"];
        this.express = express_1["default"]();
        this.connectToDb();
        this.config();
        this.mountRoutes();
    }
    App.prototype.config = function () {
        this.express.use(express_1["default"].static(path_1.resolve(__dirname, '../react-ui/build')));
        this.express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    };
    App.prototype.mountRoutes = function () {
        var _this = this;
        var router = express_1["default"].Router();
        /*************************
         *  REDIRECT URL
         *************************/
        if (process.env.NODE_ENV === 'production') {
            this.express.get('/', function (req, res) {
                res.sendFile(path_1.resolve(__dirname, '../react-ui/build'));
            });
        }
        /*************************
         *  SERVE API
         *************************/
        this.express.use('/api', body_parser_1["default"].json(), router);
        this.express.use('/quiz', body_parser_1["default"].json(), function (req, res) {
            res.sendFile(path_1.join(__dirname, '../react-ui/build', 'index.html'));
        });
        /*************************
         *  HEALTHCHECK
         *************************/
        router.get('/healthcheck', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ message: "working" });
                return [2 /*return*/];
            });
        }); });
        /*************************
         *  GET ALL QUESTIONS
         *************************/
        router.get('/questions', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request.get(process.env.BASE_API_URL + "/wp/v2/diagnostic_tool")
                            .then(function (res) { return res.body; })
                            .then(function (questions) { return questions.map(function (question) { return _this.returnQuizQuestion(question); }); })
                            .then(function (quiz) { return res.send(quiz); })["catch"](function (error) { return res.status(error.status).send(_this.handleError(error)); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        /*************************
         *  CREATE NEW PRODUCT
         *************************/
        router.post('/new-product', body_parser_1["default"].json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request.post("https://baseplus.co.uk/wp-json/wc/v3/products?consumer_key=" + process.env.WP_CONSUMER_KEY + "&consumer_secret=" + process.env.WP_CONSUMER_SECRET)
                            .send(req.body)
                            .then(function (productResponse) { return productResponse.body; })
                            .then(function (product) { return res.json(product); })["catch"](function (error) { return console.log(error); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        /*************************
         *  SAVE QUIZ ANSWERS TO DB
         *************************/
        router.post('/completed-quiz', body_parser_1["default"].json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var quizData, completedQuiz;
            return __generator(this, function (_a) {
                quizData = req.body;
                completedQuiz = new this.completedQuizModel({
                    completedQuiz: {
                        quizData: quizData
                    }
                });
                completedQuiz.save()
                    .then(function (dbResponse) { return res.json(dbResponse); })["catch"](function (error) { return res.send(error); });
                return [2 /*return*/];
            });
        }); });
        /*************************
         *  GET ALL INGREDIENTS
         *************************/
        router.get('/ingredients', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request.get(process.env.BASE_API_URL + "/wc/v3/products?consumer_key=" + process.env.WP_CONSUMER_KEY + "&consumer_secret=" + process.env.WP_CONSUMER_SECRET + "&category=35&type=simple&per_page=30")
                            .then(function (res) { return res.body; })
                            .then(function (ingredients) { return ingredients.map(function (ingredient) {
                            ingredient.rank = 0;
                            ingredient.price_html = "";
                            ingredient.description = ingredient.description.replace(/<[^>]*>?/gm, '');
                            ingredient.short_description = ingredient.short_description.replace(/<[^>]*>?/gm, '');
                            ingredient.previouslyRanked = false;
                            return ingredient;
                        }); })
                            .then(function (ingredients) { return res.send(ingredients); })["catch"](function (error) { return res.status(error.status).send(_this.handleError(error)); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        /*************************
         *  WILDCARD
         *************************/
        router.get('*', function (req, res) {
            res.sendFile(path_1.join(__dirname, '../react-ui/build', 'index.html'));
        });
    };
    App.prototype.returnQuizQuestion = function (question) {
        var _this = this;
        var answerArr = question.content.rendered.replace(/<(?:.|\n)*?>/gm, '').split(',');
        var separatedMeta = question.excerpt.rendered.replace(/<(?:.|\n)*?>/gm, '').split('|');
        var entities = new html_entities_1.Html5Entities();
        return {
            id: question.id,
            answered: false,
            prompt: question.prompt.includes("|") ? question.prompt.split("|") : question.prompt,
            isSkintoneQuestion: question.id === 716 && true,
            isSkinConditionQuestion: question.id === 1443 && true,
            customAnswer: "",
            displayAnswersAsADropdownOnMobile: answerArr.length > 5 && true,
            isMobilePanelOpen: false,
            isInputVisible: false,
            totalAnswersSelected: 0,
            question: entities.decode(question.title.rendered),
            answers: answerArr.map(function (answer, index) {
                return {
                    value: entities.decode(answer.trim()).includes("|") ? entities.decode(answer.trim()).split("|") : entities.decode(answer.trim()),
                    selected: false,
                    disable: false,
                    id: answer.trim(),
                    skinColour: question.id === 716 ? _this.skinTypeCodes[index] : "",
                    meta: separatedMeta.map(function (meta) { return meta.trim(); })
                };
            })
        };
    };
    App.prototype.connectToDb = function () {
        mongoose_1["default"].connect("" + process.env.DB_CONNECTION_STRING, { useNewUrlParser: true }, function (err) {
            if (err)
                return console.log(err.code + ", " + err.message);
            console.log("DB connection successful");
        });
    };
    App.prototype.createCompletedQuizModel = function () {
        var CompletedQuizSchema = new mongoose_1.Schema({
            completedQuiz: {
                id: {
                    type: String,
                    required: false,
                    "default": mongoose_1["default"].Types.ObjectId
                },
                date: {
                    type: Date,
                    required: false,
                    "default": Date.now
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
        });
        return mongoose_1.model('CompletedQuiz', CompletedQuizSchema);
    };
    App.prototype.handleError = function (error) {
        var response = JSON.parse(error.response.text);
        return {
            code: response.data.status,
            wordpressCode: response.code,
            info: response.message,
            error: true
        };
    };
    return App;
}());
exports["default"] = App;
