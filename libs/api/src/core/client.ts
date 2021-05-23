export class Client {
  private apiUrl: string;
  private getAuthHeader: () => Headers;

  constructor({
    apiUrl,
    getAuthorizationHeader,
  }: {
    apiUrl: string;
    getAuthorizationHeader: () => Headers;
  }) {
    this.apiUrl = apiUrl;
    this.getAuthHeader = getAuthorizationHeader;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  getAuthorizationHeader(): Headers {
    return this.getAuthHeader();
  }
}
