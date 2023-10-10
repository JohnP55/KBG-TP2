import TwoArgOperationModel from '../models/mathoperationtwoargs.js';
import OneArgOperationModel from '../models/mathoperationonearg.js';
import Controller from './Controller.js';

class Operation {
    constructor(model, cb) {
        this.model = model;
        this.cb = cb;
    }
    validate(params) {
        // The model class expects a field called `Id` because it works with repositories
        // Since we don't actually need to store operations in a repository, we have to pretend the `Id` field exists
        params.Id = 0;
        this.model.validate(params);
        delete params.Id;
    }
    execute(params) {
        this.validate(params);
        if (!this.model.state.isValid) {
            return this.model.state.errors;
        }
        return this.cb(params);
    }
}
export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
        this.operations = {
            '+': new Operation(new TwoArgOperationModel(), (p) => {
                return p.x + p.y;
            }),
            '-': new Operation(new TwoArgOperationModel(), (p) => {
                return p.x - p.y;
            }),
            '*': new Operation(new TwoArgOperationModel(), (p) => {
                return p.x * p.y;
            }),
            '/': new Operation(new TwoArgOperationModel(), (p) => {
                return p.x / p.y;
            }),
            '%': new Operation(new TwoArgOperationModel(), (p) => {
                return p.x % p.y;
            }),
            '!': new Operation(new OneArgOperationModel(), (p) => {
                if (p.n <= 0) throw new RangeError("Error: 'n' parameter must be an integer > 0");
                let total = 1;
                let c = p.n;
                while (c !== 0) {
                    total *= c--;
                };
                return total;
            }),
            'p': new Operation(new OneArgOperationModel(), (p) => {
                if (p.n <= 0) throw new RangeError("Error: 'n' parameter must be an integer > 0");
                if (p.n === 1) return false;
                if (p.n === 2 || p.n === 3) return true;
                for (let i = 2; i < Math.sqrt(p.n); i++) {
                    if(p.n % i === 0) return false;
                }
                return true;
            }),
            'np': new Operation(new OneArgOperationModel(), (p) => {
                // https://stackoverflow.com/a/57012040
                var prime=[], i=1
                while (i++ && prime.length<p.n) prime.reduce((a,c)=>(i%c)*a,2) && prime.push(i)
                return prime.length?prime.pop():-1
            }),
        }
    }

    get() {
        // HTTP replaces + with space, so we need to adjust that
        if (this.HttpContext.path.params.op === ' ') {
            this.HttpContext.path.params.op = '+';
        }
        if (this.HttpContext.path.params.op === undefined || !Object.keys(this.operations).includes(this.HttpContext.path.params.op)) {
            this.HttpContext.path.params.error = "Error: undefined operation !";
            return this.HttpContext.response.JSON(this.HttpContext.path.params);
        }

        let operation = this.operations[this.HttpContext.path.params.op];
        try {
            let value = operation.execute(this.HttpContext.path.params);
            if ([Infinity, -Infinity].includes(value) || isNaN(value)) {
                value = String(value);
            }
            if (!operation.model.state.isValid) {
                this.HttpContext.path.params.error = operation.model.state.errors[0];
                return this.HttpContext.response.JSON(this.HttpContext.path.params);
            }
            this.HttpContext.path.params["value"] = value;
            return this.HttpContext.response.JSON(this.HttpContext.path.params);
        } catch (e) {
            if (e instanceof RangeError) {
                this.HttpContext.path.params.error = e.message;
                return this.HttpContext.response.JSON(this.HttpContext.path.params);
            } else {
                throw e;
            }
        }
    }
}