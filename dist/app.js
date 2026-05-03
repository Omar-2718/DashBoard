"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const node_path_1 = __importDefault(require("node:path"));
const customerRoute_1 = __importDefault(require("./routes/customerRoute"));
const method_override_1 = __importDefault(require("method-override"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const express_session_1 = __importDefault(require("express-session"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 },
}));
app.use((0, method_override_1.default)('_method'));
app.use((0, connect_flash_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Static files
app.use(express_1.default.static(node_path_1.default.join(__dirname, '../public')));
// Template Engine
app.use(express_ejs_layouts_1.default);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.set('views', node_path_1.default.join(__dirname, '../views'));
// Routes
app.use(customerRoute_1.default);
app.get('/*splat', (req, res) => {
    return res.status(404).send('404');
});
app.use(errorController_1.default);
exports.default = app;
