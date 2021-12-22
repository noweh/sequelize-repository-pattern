# sequelize-repository-pattern

[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](licence.md)

Package providing the use of the Repository Pattern with sequelize databases.

It supports [Pino Logger](https://github.com/pinojs/pino) to get logs.

## Installation

```
npm install sequelize-repository-pattern
```

## Usage

```javascript
const AbstractRepository = require('sequelize-repository-pattern')
const { MyModel } = require('MyModelFile')
const { logger } = require('MyPinoLogger')

class MyRepository extends AbstractRepository {
  /**
   * Override parent constructor
   */
  constructor () {
    super(Client, logger) // Or, without logger: super(Client)
  }

  /**
   * Create or Update With Conditions
   * @param {BigInteger} conditionalId
   * @param {Object} myObject
   * @returns {Promise<Object>}
   */
  async createOrUpdateByConditionalId (conditionalId, myObject) {
    return await this.createOrUpdate({ conditionalId, name: myObject.name, isActive: true }, { where: { conditionalId } })
  }
}

module.exports = MyRepository
```

### The currently supported methods are:

  findOne / findAll / create / update / createOrUpdate / findOrCreate
