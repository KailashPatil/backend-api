"use strict";

const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;

const config = require("config");
const revalidator = require("revalidator");
const _ = require("underscore");

class Model {
  constructor() {}

  create(params) {
    return new Promise((resolve, reject) => {
      let err = new Error();

      let validatedObj = { valid: true };
      if (this.schema) {
        validatedObj = revalidator.validate(params, this.schema, {
          additionalProperties: this.schema.allowed_additional_properties
        });
      }
      if (!validatedObj.valid) {
        err.code = 400;
        err.message = JSON.stringify(validatedObj.errors);
        return reject(err);
      } else {
        params["created_date"] = new Date();
        params["updated_date"] = new Date();
        this.persistenceService
          .create(this.table, params)
          .then(function(doc) {
            if (doc["ops"] && doc["ops"][0]) {
              let response = doc["ops"][0];
              response["is_created"] = true;
              return resolve(response);
            } else {
              return resolve(doc);
            }
          })
          .catch(function(e) {
            return reject(e);
          });
      }
    });
  }

  mapFilters(filters) {
    if (!filters) {
      filters = {};
    }

    if (filters["_id"] && filters["_id"]["$in"]) {
      let ids = filters["_id"]["$in"];
      ids = _.map(ids, id => {
        if (id != null && !(id instanceof ObjectID) && ObjectID.isValid(id)) {
          return new ObjectID(id);
        } else {
          return id;
        }
      });
      filters["_id"]["$in"] = ids;
    }

    let options = {};
    //Do not limit when while fetching all the records
    if (filters["limit"] != "all") {
      options["limit"] = {
        offset: filters["offset"] ? parseInt(filters["offset"]) : 0,
        count: filters["limit"]
          ? parseInt(filters["limit"])
          : parseInt(config.get("default_page_limit"))
      };
    }
    delete filters["offset"];
    delete filters["limit"];

    if (filters["sort"]) {
      options["sort"] = filters["sort"];
      delete filters["sort"];
    }

    return { filters: filters, options: options };
  }

  list(filters, fields) {
    return new Promise((resolve, reject) => {
      let mappedFilters = this.mapFilters(filters);
      filters = mappedFilters["filters"];
      let options = mappedFilters["options"];

      this.persistenceService
        .get(this.table, filters, null, options)
        .then(function(docs) {
          let limit = "all";
          let offset = 0;
          if (options["limit"]) {
            limit = options["limit"]["count"];
            offset = options["limit"]["offset"];
          }
          return resolve({
            limit: limit,
            skip: offset,
            data: docs
          });
        })
        .catch(function(e) {
          return reject(e);
        });
    });
  }

  listWithTotal(filters, fields) {
    if (!filters) {
      filters = {};
    }
    let result = {
      total: 0,
      limit: filters["limit"],
      offset: filters["offset"],
      data: []
    };
    return this.count(filters)
      .then(totalCount => {
        if (totalCount == 0) {
          return Promise.resolve(result);
        }
        result.total = totalCount;
        return this.list(filters, fields);
      })
      .then(listResult => {
        result.data = listResult.data;
        return Promise.resolve(result);
      });
  }

  count(filters) {
    let localFilters = Object.assign({}, filters);
    if (localFilters.hasOwnProperty("offset")) {
      delete localFilters["offset"];
    }
    if (localFilters.hasOwnProperty("limit")) {
      delete localFilters["limit"];
    }
    if (localFilters.hasOwnProperty("sort")) {
      delete localFilters["sort"];
    }

    return this.persistenceService.count(this.table, localFilters);
  }

  get(filter) {
    return new Promise((resolve, reject) => {
      this.persistenceService
        .getOne(this.table, filter)
        .then(function(doc) {
          return resolve(doc);
        })
        .catch(function(e) {
          return reject(e);
        });
    });
  }

  update(filter, update) {
    return new Promise((resolve, reject) => {
      let err = new Error();
      let schema = { properties: {} };
      for (let key in update) {
        if (key != "_id" && key in this.schema.properties) {
          schema.properties[key] = this.schema.properties[key];
        }
      }
      let validatedObj = revalidator.validate(update, schema, {
        additionalProperties: this.schema.allowed_additional_properties
      });
      if (!validatedObj.valid) {
        process.nextTick(() => {
          err.code = 400;
          err.message = validatedObj.errors;
          return reject(err);
        });
      } else {
        update["updated_date"] = new Date();
        this.persistenceService
          .update(this.table, filter, update)
          .then(function(updatedRecords) {
            if (updatedRecords["result"]) {
              return resolve(updatedRecords["result"]);
            } else {
              return resolve(updatedRecords);
            }
          })
          .catch(function(e) {
            return reject(e);
          });
      }
    });
  }

  upsert(filter, params) {
    return new Promise((resolve, reject) => {
      let err = new Error();
      let schema = { properties: {} };
      for (let key in params) {
        if (key != "_id" && key in this.schema.properties) {
          schema.properties[key] = this.schema.properties[key];
        }
      }
      let validatedObj = revalidator.validate(params, schema, {
        additionalProperties: false
      });
      if (!validatedObj.valid) {
        process.nextTick(() => {
          err.code = 400;
          err.message = validatedObj.errors;
          return reject(err);
        });
      } else {
        params["updated_date"] = new Date();
        this.persistenceService
          .upsert(this.table, filter, params)
          .then(function(upsertedRecords) {
            if (upsertedRecords["ops"] && upsertedRecords["ops"][0]) {
              return resolve(upsertedRecords["ops"][0]);
            } else if (upsertedRecords["result"]) {
              return resolve(upsertedRecords["result"]);
            } else {
              return resolve(upsertedRecords);
            }
          })
          .catch(function(e) {
            return reject(e);
          });
      }
    });
  }

  delete(filter) {
    return new Promise((resolve, reject) => {
      this.persistenceService
        .delete(this.table, filter)
        .then(function(deletedRecords) {
          if (deletedRecords["result"]) {
            return resolve(deletedRecords["result"]);
          } else {
            return resolve(deletedRecords);
          }
        })
        .catch(function(e) {
          return reject(e);
        });
    });
  }

  distinct(field, filters) {
    return new Promise((resolve, reject) => {
      this.persistenceService
        .distinct(this.table, field, filters)
        .then(function(values) {
          return resolve(values);
        })
        .catch(function(e) {
          return reject(e);
        });
    });
  }

  getInstanceOfObjectId(id) {
    let ObjID = id;
    if (id != null && !(id instanceof ObjectID) && ObjectID.isValid(id)) {
      ObjID = ObjectID(id);
    }
    return Promise.resolve(ObjID);
  }

  closeConnection() {
    if (this.persistenceService) {
      this.persistenceService.closeConnection();
    }
  }
}

module.exports = Model;
