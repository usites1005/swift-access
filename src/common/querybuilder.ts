import IQuery from '../types/queryTypes';

class QueryBuilder {
  data: IQuery;
  query: { $lte: Date; $gte: Date } | undefined;
  constructor(query: IQuery) {
    this.data = query;
  }

  static default() {
    let from = new Date().getMonth();
    let to = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    return {
      $lte: new Date(year, to),
      $gte: new Date(year, from),
    };
  }

  parseTimeline() {
    let data = this.data;
    this.query = QueryBuilder.default();

    if (data.p === 'range') {
      let from = data.from as string;
      let to = data.to as string;
      this.query = QueryBuilder.range(from, to);
    } else if (data.p === 'month') {
      let month = data.month as string;
      this.query = QueryBuilder.month(month);
    } else if (data.p === 'year') {
      let year = data.year as string;
      this.query = QueryBuilder.year(year);
    }
    return this;
  }

  static range(from: string, to: string) {
    //attach time
    let timeEnd = 'T23:59:59';
    let timeStart = 'T00:00:01';
    let start = from.split('T')[0] + timeStart;
    let end = to.split('T')[0] + timeEnd;
    return {
      $lte: new Date(end),
      $gte: new Date(start),
    };
  }

  static year(from: string) {
    let to = `${+from + 1}`;
    return {
      $lte: new Date(to),
      $gte: new Date(from),
    };
  }

  static month(from: string) {
    let to = +from + 1;
    const year = new Date().getFullYear();
    return {
      $lte: new Date(year, to),
      $gte: new Date(year, +from),
    };
  }
}

export default QueryBuilder;
