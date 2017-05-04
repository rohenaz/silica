import Base from './base.js'

class State {
  onEnter(ctrl)
  {
  }

  onExit(ctrl)
  {
  }
}

State.prototype['onEnter'] = State.prototype.onEnter;
State.prototype['onExit'] = State.prototype.onExit;

// ##Silica.Controllers.FSM
// This is a Finite state machine based controller
/** @unrestricted */
class FSM extends Base
{
  // The constructor binds the element to the controller and sets its scope
  // When subclassing remember to **call super**
  constructor(el)
  {
    super(el)
    let stateDefinitions = this.constructor['states'];
    this._states = {};
    for (const stateName in stateDefinitions) {
      this._states[stateName] = new stateDefinitions[stateName];
    }

    /**
     * @private {State}
     */
    this._currentState = new State();

    if (this._states["base"]) {
      this.transition("base");
    }
  }

  static get states()
  {
    return {
      "base": State
    }
  }


  transition(stateName)
  {
    let target = this._states[stateName];
    if (!target)
    {
      throw "Unknown state " + stateName +" in " + this.constructor.name;
    }

    if (target == this._currentState)
    {
      return;
    }

    this._currentState['onExit'](this);
    this._currentState = target;
    this._currentStateName = stateName;
    Silica.defer(() => {
      this._currentState['onEnter'](this);
    });
  }

}

Object.defineProperties(FSM.prototype, {
  'currentState': {
    configurable: 0,
    enumerable: 0,
    /** @suppress {globalThis} */
    get: function() {
      return this._currentStateName;
    }
  }
});

let exports = {
 'Controller'  :  FSM,
 'State'       :  State
};


export default exports;