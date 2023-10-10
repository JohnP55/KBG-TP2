import Model from './model.js';

export default class MathOperationTwoArgs extends Model {
    constructor() {
        super();

        this.addField('op', 'string');
        this.addField('x', 'float');
        this.addField('y', 'float');
              
        this.setKey("op");
    }
}