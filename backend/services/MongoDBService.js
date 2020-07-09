const util = require('util');
const mongoClient = require('mongodb').MongoClient;

class MongoDBService {
    constructor(url, databaseName) {
        this.url = url;
        this.databaseName = databaseName;
    }

    async connect() {
        const connect = util.promisify(mongoClient.connect);

        this.client = await connect(this.url);
        this.database = this.client.db(this.databaseName);
    }

    disconnect() {
        this.client.close();
    }

    find(collection, parameters = {}) {
        return new Promise((resolve, reject) => {
            this.database.collection(collection).find(parameters).toArray(function(error, data) {
                if (error) reject();

                resolve(data);
            });
        });
    }

    findOne(collection, parameters) {
        return new Promise((resolve, reject) => {
            this.database.collection(collection).findOne(parameters, function(error, data) {
                if (error) reject();

                resolve(data);
            });
        });
    }

    insert(collection, parameters) {
        return new Promise((resolve, reject) => {
            this.database.collection(collection).insertOne(parameters, function(error) {
                if (error) reject();

                resolve();
            });
        });
    }

    

    
}

module.exports = MongoDBService;