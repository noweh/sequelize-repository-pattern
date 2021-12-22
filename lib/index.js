class AbstractRepository {
  /**
   * Constructor, allows to use model directly in repository methods
   * @param {Object} model
   * @param {Object} logger
   */
  constructor (model, logger = null) {
    if (this.constructor === AbstractRepository) {
      throw new TypeError('Abstract class "AbstractRepository" cannot be instantiated directly')
    }
    if (model === undefined) {
      throw new TypeError('Model cannot be empty')
    }

    this.model = model

    if (logger) {
      this.logger = logger
    }
  }

  /**
   * Override Sequelize.model.findOne to add cache and logs
   * @param {Object} options - existing options of Sequelize.model.findOne
   * @returns {Object}
   */
  findOne (options) {
    return this.model.findOne(options)
      .then(item => {
        if (this.logger) {
          this.logger.child({ options, item }).info('FindOne request')
        }

        return item
      })
      .catch(error => {
        if (this.logger) {
          this.logger.child({ options, error }).error('FindOne request')
        }

        throw new TypeError('Error with findOne function')
      })
  }

  /**
   * Override Sequelize.model.findAll to add cache and logs
   * @param {Object} options - existing options of Sequelize.model.findAll
   * @returns {Object}
   */
  async findAll (options = {}) {
    return await this.model.findAll(options)
      .then(items => {
        if (this.logger) {
          this.logger.child({ options, items }).info('FindAll request')
        }

        return items
      })
      .catch(error => {
        if (this.logger) {
          this.logger.child({ options, error }).error('FindAll request')
        }

        throw new TypeError('Error with findAll function')
      })
  }

  /**
   * Override Sequelize.model.create to add logs
   * @param {Object} data
   * @returns {Object}
   */
  create (data) {
    return this.model.create(data)
      .then(item => {
        // Create can return item in .then
        if (this.logger) {
          this.logger.child({ item, data }).info('Create request')
        }
        return item
      })
      .catch(error => {
        if (this.logger) {
          this.logger.child({ data, error }).error('Create request')
        }

        throw new TypeError('Error with create function')
      })
  }

  /**
   * Override sequelize.model.update to add logs
   * @param {Object} data
   * @param {Object} options
   * @returns {Object}
   */
  update (data, options) {
    return this.model.update(data, options)
      .then(() => {
        // Update not return item in .then, we have to call findOne to have the item
        return this.model.findAll(options)
      })
      .then(items => {
        if (this.logger) {
          this.logger.child({ items, data, options }).info('Update request')
        }
      })
      .catch(error => {
        if (this.logger) {
          this.logger.child({ data, options, error }).error('Update request')
        }

        throw new TypeError('Error with update function')
      })
  }

  /**
   * Use Create if findOne doesn't returns item, or use Update
   * @param {Object} data
   * @param {Object} options
   * @returns {Object}
   */
  createOrUpdate (data, options) {
    return this.findOne(options)
      .then(item => {
        if (item) {
          // Update
          return this.update(data, options)
        }

        return this.create(data)
      })
  }

  /**
   * Override Sequelize.model.findOrCreate
   * @param options
   * @returns {Object}
   */
  findOrCreate (options) {
    return this.model.findOrCreate(options)
      .then(item => {
        return item
      })
  }
}

module.exports = AbstractRepository
