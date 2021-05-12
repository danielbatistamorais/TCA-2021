"use strict";
/*
 * @adonisjs/core
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const ace_1 = require("@adonisjs/ace");
/**
 * A command to display a list of routes
 */
class ListRoutes extends ace_1.BaseCommand {
    /**
     * Returns an array of routes as JSON
     */
    outputJSON(router) {
        const routes = router.toJSON();
        return Object.keys(routes).reduce((result, domain) => {
            result[domain] = routes[domain].map((route) => {
                let handler = 'Closure';
                const middleware = route
                    ? route.middleware.map((one) => (typeof one === 'function' ? 'Closure' : one))
                    : [];
                if (route.meta.resolvedHandler.type !== 'function' && route.meta.namespace) {
                    handler = `${route.meta.resolvedHandler['namespace']}.${route.meta.resolvedHandler['method']}`;
                }
                else if (route.meta.resolvedHandler.type !== 'function') {
                    const method = route.meta.resolvedHandler['method'];
                    const routeHandler = route.handler;
                    handler = `${routeHandler.replace(new RegExp(`.${method}$`), '')}.${method}`;
                }
                return {
                    methods: route.methods,
                    name: route.name || '',
                    pattern: route.pattern,
                    handler: handler,
                    middleware: middleware,
                };
            });
            return result;
        }, {});
    }
    /**
     * Output routes a table string
     */
    outputTable(router) {
        const routes = this.outputJSON(router);
        const domains = Object.keys(routes);
        const showDomainHeadline = domains.length > 1 || domains[0] !== 'root';
        const table = this.ui.table().head(['Method', 'Route', 'Handler', 'Middleware', 'Name']);
        domains.forEach((domain) => {
            if (showDomainHeadline) {
                table.row([{ colSpan: 5, content: `Domain ${this.colors.cyan(domain)}` }]);
            }
            routes[domain].forEach((route) => {
                table.row([
                    this.colors.dim(route.methods.join(', ')),
                    route.pattern,
                    typeof route.handler === 'function' ? 'Closure' : route.handler,
                    route.middleware.join(','),
                    route.name,
                ]);
            });
        });
        table.render();
    }
    /**
     * Log message
     */
    log(message) {
        if (this.application.environment === 'test') {
            this.logger.log(message);
        }
        else {
            console.log(message);
        }
    }
    async run() {
        const Router = this.application.container.use('Adonis/Core/Route');
        /**
         * Commit routes before we can read them
         */
        Router.commit();
        if (this.json) {
            this.log(JSON.stringify(this.outputJSON(Router), null, 2));
        }
        else {
            this.outputTable(Router);
        }
    }
}
ListRoutes.commandName = 'list:routes';
ListRoutes.description = 'List application routes';
/**
 * Load application
 */
ListRoutes.settings = {
    loadApp: true,
};
__decorate([
    ace_1.flags.boolean({ description: 'Output as JSON' }),
    __metadata("design:type", Boolean)
], ListRoutes.prototype, "json", void 0);
exports.default = ListRoutes;
