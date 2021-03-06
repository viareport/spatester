/**
 * Action class
 * @abstract
 *
 * All possible action in a scenario should create an instance of an Action subtypes
 * Those subtype must define an _exec method
 */

var actions = {};

function Action() {
}
Action.prototype = {
    exec: function () {
        if (!this._exec) {
            throw new Error("Trying to exec an action which doesn't inherit from Action Class");
        }

        this._exec();
    },
    toString: function () {
        return this.name;
    }
};

/**
 * WaitAction class
 * @extend Action
 *
 * Parameter could be either :
 * - a function, in this case delay the execution until the function returns true
 * - a selector, in this case delay the execution until the given selector is found in the DOM
 */
function WaitAction(parameter, callerLine) {

    var handleRes = function(res) {
        if (!res) {
            var error = new Error();
            error.type="waitfor";
            throw error;
        }
        return res;
    };
    
    if(typeof parameter === 'function') {
        this.waitFor = function() {
            return handleRes(parameter.apply());
        };
        this.name = "Wait for the function " + parameter +" to return true";
    } else {
        this.waitFor = function() {
            return handleRes(document.querySelector(parameter));
        };
        this.name = "Wait for an element matching the selector " + parameter;
    }

    
    this.callerLine = callerLine;
}
WaitAction.prototype = new Action();
WaitAction.constructor = WaitAction;
WaitAction.prototype._exec = function () {
};

actions.WaitAction = WaitAction;

/**
 * DebugAction
 * @extend Action
 *
 * insert a debug point
 */
function DebugAction() {
}
DebugAction.prototype = new Action();
DebugAction.constructor = DebugAction;
DebugAction.prototype._exec = function () {
    debugger;
};
actions.DebugAction = DebugAction;

/**
 * ExecAction class
 * @extend Action
 *
 * Execute a function in the DOM
 */
function ExecAction(fn, callerLine) {
    this.fn = fn;
    this.name = "Executing function " + fn.toString();
    this.callerLine = callerLine;
}
ExecAction.prototype = new Action();
ExecAction.constructor = ExecAction;
ExecAction.prototype._exec = function () {
    this.fn();
};

actions.ExecAction = ExecAction;

/**
 * ClickAction class
 * @extend Action
 *
 * Click on a given selector
 */
function ClickAction(selector, callerLine) {
    this.selector = selector;
    this.name = "click on element matching selector " + selector;
    this.callerLine = callerLine;
}
ClickAction.prototype = new Action();
ClickAction.constructor = ClickAction;
ClickAction.prototype._exec = function () {
    try {
        var selectedElem = document.querySelector(this.selector);
        selectedElem.click();
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('mousedown', true, true,document.defaultView, 0, 0, 0, selectedElem.offsetTop, selectedElem.offsetLeft, false,
         false, false, false, 1, null);
        selectedElem.dispatchEvent(event);
    } catch (e) {
        throw new Error('Can\'t click on element: ' + this.selector, e);
    }
};

actions.ClickAction = ClickAction;

/**
 * DoubleClickAction class
 * @extend Action
 *
 * DoubleClick on a given selector
 */
function DoubleClickAction(selector, callerLine) {
    this.selector = selector;
    this.name = "double click on element matching selector " + selector;
    this.callerLine = callerLine;
}
DoubleClickAction.prototype = new Action();
DoubleClickAction.constructor = DoubleClickAction;
DoubleClickAction.prototype._exec = function () {
    try {
        var event = document.createEvent("MouseEvent");
        event.initEvent('dblclick', true, true);
        document.querySelector(this.selector).dispatchEvent(event);
    } catch (e) {
        throw new Error('Can\'t double click on element: ' + this.selector, e);
    }
};

actions.DoubleClickAction = DoubleClickAction;

/**
 * KeyboardAction class
 * @extend Action
 *
 * Keyboard action on a given selector
 */
function KeyboardAction(selector, action, chromeCode, ffCode, shiftKeyArg, ctrlKeyArg, callerLine) {
    this.selector = selector;
    this.action = action;
    this.chromeCode = chromeCode;
    this.ffCode = ffCode;
    this.shiftKeyArg = shiftKeyArg ? shiftKeyArg : false;
    this.ctrlKeyArg = ctrlKeyArg ? ctrlKeyArg : false;
    this.name = action + " on element matching selector " + selector;
    this.callerLine = callerLine;
}
KeyboardAction.prototype = new Action();
KeyboardAction.constructor = KeyboardAction;
KeyboardAction.prototype._exec = function () {
    try {
        var event = document.createEvent("KeyboardEvent");
        if (event.initKeyboardEvent) {  // Chrome, IE
            event.initKeyboardEvent(this.action, true, true, document.defaultView, this.chromeCode, 0, "", false, "");
        } else { // FF
            event.initKeyEvent(this.action, true, true, document.defaultView, this.ctrlKeyArg, false, this.shiftKeyArg, false, this.ffCode, 0);
        }
        document.querySelector(this.selector).dispatchEvent(event);
    } catch (e) {
        throw new Error('Can\'t ' + this.action + ' on element: ' + this.selector, e);
    }
};

actions.KeyboardAction = KeyboardAction;

/**
 * SelectAction class
 * @extend Action
 *
 * Select the given value from the given list
 */
function SelectAction(selector, value, callerLine) {
    this.selector = selector;
    this.value = value;
    this.name = "Select option with value " + value + " in the list matching the selector " + selector;
    this.callerLine = callerLine;
}
SelectAction.prototype = new Action();
SelectAction.constructor = SelectAction;
SelectAction.prototype._exec = function () {
    try {
        // Simulate the click to allow custom js to execute
        var list = document.querySelector(this.selector);
        var option = document.querySelector(this.selector + " option[value='" + this.value + "']");
        list.click();
        option.click();

        // Really select the value
        list.selectedIndex = option.index;
    } catch (e) {
        throw new Error("Can't select the value " + this.value + " in list " + this.selector, e);
    }
};

actions.SelectAction = SelectAction;

/**
 * FillAction class
 * @extend Action
 *
 * Set the value of a given field with the given value
 */
function FillAction(selector, value, callerLine) {
    this.selector = selector;
    this.value = value;
    this.name = "Fill input matching selector " + selector + " with value " + value;
    this.callerLine = callerLine;
}
FillAction.prototype = new Action();
FillAction.constructor = FillAction;
FillAction.prototype._exec = function () {
    try {
        document.querySelector(this.selector).setAttribute('value', this.value);
    } catch (e) {
        throw new Error('Can\'t fill element: ' + this.selector + ' with value ' + this.value, e);
    }
};

actions.FillAction = FillAction;


//TODO A supprimer
/**
 * TestAction class
 * @extend Action
 *
 * Run a given assertion
 */
function TestAction(assertion, callerLine) {
    this.assertion = assertion;
    this.callerLine = callerLine;
    this.name = assertion.description;
    this.waitFor = assertion.waitFor;
}
TestAction.prototype = new Action();
TestAction.constructor = TestAction;
TestAction.prototype._exec = function () {
    this.assertion.test();
};

actions.TestAction = TestAction;

module.exports = actions;
