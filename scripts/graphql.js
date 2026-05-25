const AEM_HOST = 'https://publish-p178261-e1872848.adobeaemcloud.com';

export default class GraphQLClient {
  constructor(host, configPath) {
    this.host = host;
    this.configPath = configPath;
  }

  static new(configPath) {
    return new GraphQLClient(AEM_HOST, configPath);
  }

  #buildURL() {
    return `${this.host}/graphql/execute.json${this.configPath}`;
  }

  static #convertParamsToQueryString(params) {
    // conversion consists in ';' separated key=value pairs, where value is URI encoded
    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join(';');
  }

  async findItems(params) {
    const url = `${this.#buildURL()};${GraphQLClient.#convertParamsToQueryString(params)}`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(`Failed to fetch Content Fragment: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    const root = Object.values(json)[0]; // unwrap first key

    // Unwrap "item" (singular) or "items" (list)
    console.log(root);
    const result = Object.values(root)[0]?.item ?? Object.values(root)[0]?.items ?? root;
    console.log(result);
    return result;
  }
}
