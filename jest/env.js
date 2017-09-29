import ElasticSearch from 'elasticsearch';

process.env.DEBUG = 'app:component:Toolbar:propertyContentSave';
process.env.NODE_ENV = 'test';
process.env.DEBUG_TEST = true;
process.env.GQLOG = false;

const elasticSearchInit = () => {
  let client;
  if (process.env.NODE_ENV === 'test' && process.env.USERNAME === 'gfoda0') {
    client = new ElasticSearch.Client({
      host: 'http://localhost:9200',
      log: {
        type: 'file',
        level: 'trace',
        path: `${__dirname}/elasticSearch.log`,
      },
    });
  }
  return client;
};

process.env.ESClient = elasticSearchInit();
