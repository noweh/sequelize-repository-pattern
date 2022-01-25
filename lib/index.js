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
   * @returns {Promise<Object>}
   */
  async findOne (options) {
    try {
      item = await this.model.findOne(options)
      if (this.logger) {
         await this.logger.child({ options, item }).info('FindOne request')
      }
      return item
    } catch (error) {
      if (this.logger) {
        await this.logger.child({ options, error }).error('FindOne request')
      }

      throw new TypeError('Error with findOne function')
    }
  }

  /**
   * Override Sequelize.model.findAll to add cache and logs
   * @param {Object} options - existing options of Sequelize.model.findAll
   * @returns {Promise<Object>}
   */
  async findAll (options = {}) {
    try {
      items = await this.model.findAll(options)
      if (this.logger) {
        await logger.child({ options, items }).info('FindAll request')
      }
    } catch (error) {
      if (this.logger) {
        await logger.child({ options, error }).error('FindAll request')
      }
      throw new TypeError('Error with findAll function')
    }
  }

  /**
   * Override Sequelize.model.create to add logs
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create (data) {
    try {
      // Create function return item
      const item = await this.model.create(data)
      if (this.logger) {
          await this.logger.child({ item, data }).info('Create request')
        }
        return item
    } catch (error) {
      if (this.logger) {
        await this.logger.child({ data, error }).error('Create request')
      }
      throw new TypeError('Error with create function')
    }
  }

  /**
   * Override sequelize.model.update to add logs
   * @param {Object} data
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  async update (data, options) {
    try {
      // Update function dont return item
      await this.model.update(data, options)
      // Update not return item , so we have to call findOne to have the item
      const item = await this.model.findOne(options)
      if (this.logger) {
        await logger.child({ item, data, options }).info('Update request')
      }
      return item
    } catch (error) {
      if (this.logger) {
        await this.logger.child({ data, options, error }).error('Update request')
      }

      throw new TypeError('Error with update function')
    }
  }

  /**
   * Use Create if findOne doesn't returns item, or use Update
   * @param {Object} data
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  async createOrUpdate (data, options) {
    const item = await this.findOne(options)
    
    if (item) {
      // Update
      return await this.update(data, options)
    }

    return await this.create(data)
  }

  /**
   * Override Sequelize.model.findOrCreate
   * @param options
   * @returns {Promise<Object>}
   */
  async findOrCreate (options) {
    return await this.model.findOrCreate(options)
  }
}

module.exports = AbstractRepository
