import { ParsedUrlQuery } from 'querystring';

interface IQuery extends ParsedUrlQuery {
  cd?: string;
  ph?: string;
  from?: string;
  to?: string;
  p?: string;
  month?: string;
  year?: string;
}

export default IQuery;
