"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
var html_entities_1 = require("html-entities");
var ErrorTypes_1 = require("./../react-ui/src/Interfaces/ErrorTypes");
var request = __importStar(require("superagent"));
var mixpanel = __importStar(require("mixpanel"));
var path_1 = require("path");
var fs_1 = __importDefault(require("fs"));
var os_1 = __importDefault(require("os"));
var mongoose_1 = __importStar(require("mongoose"));
var honeybadger_1 = __importDefault(require("honeybadger"));
dotenv_1["default"].config();
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.completedQuizModel = this.createCompletedQuizModel();
        this.customProductModel = this.createCustomProductModel();
        this.mixPanelClient = mixpanel.init("" + process.env.MIXPANEL_ID);
        this.newFileName = "";
        this.skinTypeCodes = ["#F1EAE1", "#F6E4E3", "#F0D4CA", "#E2AE8D", "#9E633C", "#5E3C2B"];
        this.generateRandomString = function () {
            return Math.random().toString().split('.')[1].slice(0, 5);
        };
        this.getGmtTime = function () {
            var utc = new Date();
            return utc.setHours(utc.getHours() + 1);
        };
        this.writeDbDataTOCSV = function (dbData) {
            var newFileNameFilePath = path_1.join(__dirname, '../react-ui/src/Assets/', "" + _this.newFileName);
            if (dbData.length > 0) {
                var output_1 = [];
                var dbDataAsObject = dbData[0].toObject();
                var dataHeadings = __spreadArrays(["id", "date"], Object.values(dbDataAsObject.quiz.map(function (quiz) {
                    if (quiz.question.includes(','))
                        return quiz.question.split(',').join('-');
                    return quiz.question;
                })));
                output_1.push(dataHeadings.join());
                dbData.forEach(function (dbEntry) {
                    var row = [];
                    var JSDbObject = dbEntry.toObject();
                    var quizDate = new Date(JSDbObject.date);
                    row.push.apply(row, __spreadArrays([JSDbObject.id, quizDate.getDate() + "/" + (quizDate.getMonth() + 1) + "/" + quizDate.getFullYear()], JSDbObject.quiz.map(function (quiz) {
                        if (quiz.answer.includes(','))
                            return quiz.answer.split(',').join(' - ');
                        return quiz.answer;
                    })));
                    output_1.push(row.join());
                });
                fs_1["default"].writeFileSync(newFileNameFilePath, output_1.join(os_1["default"].EOL));
                console.log('has a new file been written?', fs_1["default"].existsSync(newFileNameFilePath));
                var updatedStats = fs_1["default"].statSync(newFileNameFilePath);
                console.log('new file name', newFileNameFilePath);
                console.log('paths in folder', fs_1["default"].readdirSync(path_1.join(__dirname, '../react-ui/src/Assets/')));
                console.log('new file size', updatedStats["size"] / 1000000.0);
            }
        };
        this.express = express_1["default"]();
        this.configureHoneyBadger();
        this.config();
        this.mountRoutes();
        this.connectToDb();
    }
    App.prototype.config = function () {
        this.express.use(express_1["default"].static(path_1.resolve(__dirname, '../react-ui/build')));
        this.express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    };
    App.prototype.configureHoneyBadger = function () {
        honeybadger_1["default"].configure({
            apiKey: "" + process.env.HONEYBADGER_API_KEY
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
         *  SERVE ROUTES
         *************************/
        this.express.use(honeybadger_1["default"].requestHandler);
        this.express.use('/api', body_parser_1["default"].json(), router);
        this.express.use('/quiz', body_parser_1["default"].json(), function (req, res) {
            res.sendFile(path_1.join(__dirname, '../react-ui/build', 'index.html'));
        });
        this.express.use('/download-data', body_parser_1["default"].json(), function (req, res) {
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
                            .then(function (quiz) { return res.send(quiz); })["catch"](function (error) {
                            if (error instanceof TypeError) {
                                honeybadger_1["default"].notify(error.name + ": " + error.message, ErrorTypes_1.IHoneyBadgerErrorTypes.CODE);
                                res.status(500).end();
                                return;
                            }
                            honeybadger_1["default"].notify("Error " + _this.handleError(error).code + ", " + _this.handleError(error).message, ErrorTypes_1.IHoneyBadgerErrorTypes.APIREQUEST);
                            res.status(error.status).send(_this.handleError(error));
                        })];
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
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request.post(process.env.BASE_API_URL + "/wc/v3/products?consumer_key=" + process.env.WP_CONSUMER_KEY + "&consumer_secret=" + process.env.WP_CONSUMER_SECRET)
                            .send(req.body)
                            .then(function (productResponse) { return productResponse.body; })
                            .then(function (product) { return res.send(product); })["catch"](function (error) {
                            honeybadger_1["default"].notify("Error " + _this.handleError(error).code + ", " + _this.handleError(error).message, ErrorTypes_1.IHoneyBadgerErrorTypes.APIREQUEST);
                            res.status(error.status).send(_this.handleError(error));
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        /*************************
         *  GET COMPLETED QUIZ ANSWERS
         *************************/
        router.get('/completed-quiz', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.completedQuizModel.find()
                    .then(function (dbResponse) {
                    var quizzes = dbResponse.map(function (x) { return x.toJSON(); });
                    var date = new Date(quizzes[quizzes.length - 1].date).toLocaleString();
                    var fileName = "completed-quiz-" + _this.generateRandomString() + ".csv";
                    var valuesForDashboard = {
                        totalQuizItems: quizzes.length,
                        latestQuizDate: date,
                        fileName: fileName
                    };
                    _this.newFileName = fileName;
                    res.send(valuesForDashboard);
                    _this.writeDbDataTOCSV(dbResponse);
                })["catch"](function (error) {
                    honeybadger_1["default"].notify("Error retrieving completed quizzes: " + error.message, ErrorTypes_1.IHoneyBadgerErrorTypes.DATABASE);
                    res.send(error);
                });
                return [2 /*return*/];
            });
        }); });
        /*************************
         *  LOG ANALYTICS
         *************************/
        router.post('/analytics', function (req, res) {
            var data = req.body;
            var distinct_id = data.distinct_id, question_id = data.question_id, ingredients = data.ingredients, event_type = data.event_type;
            _this.mixPanelClient.track(event_type, {
                distinct_id: distinct_id,
                question_id: question_id,
                ingredients: ingredients
            }, function (response) {
                if (response instanceof Error) {
                    res.send(response);
                    honeybadger_1["default"].notify("Error logging analytics: " + response.message, ErrorTypes_1.IHoneyBadgerErrorTypes.ANALYTICS);
                    return;
                }
                res.send(response);
                console.log("Logged analytics event " + data.event_type);
            });
        });
        /*************************
         *  SAVE QUIZ ANSWERS TO DB
         *************************/
        router.post('/save-quiz', body_parser_1["default"].json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var uiRequest, completedQuiz;
            return __generator(this, function (_a) {
                uiRequest = req.body;
                completedQuiz = new this.completedQuizModel({
                    quiz: uiRequest.quiz,
                    productId: uiRequest.productId,
                    date: this.getGmtTime()
                });
                console.log(completedQuiz);
                completedQuiz.save()
                    .then(function (dbResponse) {
                    console.log("Saved completed quiz with id " + dbResponse.id);
                    res.send(dbResponse);
                })["catch"](function (error) {
                    honeybadger_1["default"].notify("Error saving quiz: " + error, ErrorTypes_1.IHoneyBadgerErrorTypes.DATABASE);
                    if (error.name === "ValidationError") {
                        res.status(400).send({ message: error.message });
                        return;
                    }
                    res.send(error);
                });
                return [2 /*return*/];
            });
        }); });
        /*************************
         *  SAVE PRODUCTS TO DB
         *************************/
        router.post('/save-product', body_parser_1["default"].json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var customProductRequest, customProduct;
            return __generator(this, function (_a) {
                customProductRequest = req.body;
                customProduct = new this.customProductModel({
                    ingredients: customProductRequest.ingredients,
                    amended: customProductRequest.amended,
                    productId: customProductRequest.productId,
                    date: this.getGmtTime()
                });
                customProduct.save()
                    .then(function (dbResponse) {
                    console.log("Saved custom product with id " + dbResponse.id);
                    res.send(dbResponse);
                })["catch"](function (error) {
                    honeybadger_1["default"].notify("Error saving product: " + error.message, ErrorTypes_1.IHoneyBadgerErrorTypes.DATABASE);
                    if (error.name === "ValidationError") {
                        res.status(400).send({ message: error.message });
                        return;
                    }
                    res.send(error);
                });
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
                            ingredient.isSelectedForSummary = false;
                            return ingredient;
                        }); })
                            .then(function (ingredients) { return res.send(ingredients); })["catch"](function (error) {
                            if (error instanceof TypeError) {
                                honeybadger_1["default"].notify(error.name + ": " + error.message, ErrorTypes_1.IHoneyBadgerErrorTypes.CODE);
                                res.status(500).end();
                                return;
                            }
                            honeybadger_1["default"].notify("Error " + _this.handleError(error).code + ", " + _this.handleError(error).message);
                            res.status(error.status).send(_this.handleError(error));
                        })];
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
            isFullScreen: false,
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
        var _this = this;
        mongoose_1["default"].connect("" + process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(function (_) {
            console.log("Db connection successful");
            _this.listenForErrorsAfterConnection();
        })["catch"](function (error) {
            honeybadger_1["default"].notify("Database connection error: " + error.message, ErrorTypes_1.IHoneyBadgerErrorTypes.DATABASE);
        });
    };
    App.prototype.listenForErrorsAfterConnection = function () {
        mongoose_1["default"].connection.on('error', function (err) {
            honeybadger_1["default"].notify(err.message, ErrorTypes_1.IHoneyBadgerErrorTypes.DATABASE);
        });
    };
    App.prototype.createCompletedQuizModel = function () {
        var CompletedQuizSchema = new mongoose_1.Schema({
            date: {
                type: Date,
                required: false,
                "default": Date.now
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
        });
        return mongoose_1.model('completed-quizzes', CompletedQuizSchema);
    };
    App.prototype.createCustomProductModel = function () {
        var CustomProductSchema = new mongoose_1.Schema({
            productId: {
                type: Number,
                required: true
            },
            amended: {
                type: Boolean,
                required: true,
                "default": false
            },
            date: {
                type: Date,
                required: false,
                "default": Date.now
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
        });
        return mongoose_1.model('custom-products', CustomProductSchema);
    };
    App.prototype.handleError = function (error) {
        var response = JSON.parse(error.response.text);
        return {
            code: response.data.status,
            wordpressCode: response.code,
            message: response.message,
            error: true
        };
    };
    return App;
}());
exports["default"] = App;
