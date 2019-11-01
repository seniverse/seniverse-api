
export class MethodMissing {
  constructor(...args) {
    for (const arg of args) {
      this[arg] = arg
    }

    const handler = {
      get: this._handleMissingMethod.bind(this)
    }
    return new Proxy(this, handler)
  }

  _handleMissingMethod(target, name) {
    if (Reflect.has(target, name)) {
      return Reflect.get(target, name)
    }
    return (...args) => this.methodMissing(name, ...args)
  }

  methodMissing(name, ...args) {
    throw new Error(`Method ${name} is missing!`)
  }
}

export class AttributeMissing {
  constructor(...args) {
    const handler = {
      get: this._handleMissingAttribute.bind(this)
    }
    return new Proxy(this, handler)
  }

  private _handleMissingAttribute(target: object, name: string) {
    if (Reflect.has(target, name)) {
      return Reflect.get(target, name)
    }
    return this.attributeMissing(name)
  }

  protected attributeMissing(name: string) {
    throw new Error(`Attribute ${name} is missing!`)
  }
}
