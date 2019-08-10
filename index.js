"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var server_1 = __importDefault(require("./server"));
var app = new server_1["default"]().express;
var port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log("server is listening on " + port);
});
