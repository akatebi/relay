
const { length } = 'http://localhost:52395/api/v1/';

export const elasticSearch = async ({ url, data, options }) => {
  const { ESClient: client } = process.env;
  const { method = 'GET' } = options;
  if (method === 'GET' && client.create) {
    const [index, type, id = 1] = url.slice(length).split('/');
    console.log('index, type, id', index, type, id);
    try {
      await client.create({ index, type, id, body: data });
    } catch (exp) {
      console.error(exp);
    }

  }
  return data;
};
