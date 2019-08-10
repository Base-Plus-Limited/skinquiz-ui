"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var express_1 = __importStar(require("express"));
var Routes = /** @class */ (function () {
    function Routes() {
        this.express = express_1["default"]();
        this.router = express_1.Router();
    }
    Routes.prototype.getAllQuestions = function () {
        this.router.get("/", function (req, res) {
            res.json({ message: "sdsd" });
        });
    };
    return Routes;
}());
exports["default"] = Routes;
