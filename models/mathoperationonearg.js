import Model from './model.js';

export default class MathOperationOneArg extends Model {
    constructor() {
        super();

        this.addField('op', 'string');
        this.addField('n', 'integer');
              
        this.setKey("op");
    }
}