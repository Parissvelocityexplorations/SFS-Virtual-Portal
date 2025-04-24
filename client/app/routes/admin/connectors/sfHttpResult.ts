export class HttpResult<T> {

  public constructor(statusCode: number, reasonPhrase: string, content: Nullable<T> = undefined) {
    this.statusCode = statusCode;
    this.reasonPhrase = reasonPhrase;
    this.content = content;
  }

  public statusCode: number = 200;
  public reasonPhrase: string = "";
  public content: Nullable<T> = {};

  public get isSuccessStatusCode(): boolean {
    return this.statusCode >= 200 && this.statusCode <= 299;
  }
}