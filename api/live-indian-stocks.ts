import quotesHandler from "./quotes.js";

export default function handler(req: any, res: any) {
  return quotesHandler(req, res);
}
