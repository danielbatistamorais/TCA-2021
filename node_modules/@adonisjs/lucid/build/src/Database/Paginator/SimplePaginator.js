"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplePaginator = void 0;
const qs_1 = require("qs");
/**
 * Simple paginator works with the data set provided by the standard
 * `offset` and `limit` based pagination.
 */
class SimplePaginator extends Array {
    constructor(rows, totalNumber, perPage, currentPage) {
        super(...rows);
        this.rows = rows;
        this.totalNumber = totalNumber;
        this.perPage = perPage;
        this.currentPage = currentPage;
        this.qs = {};
        this.url = '/';
        /**
         * The first page is always 1
         */
        this.firstPage = 1;
        /**
         * Find if results set is empty or not
         */
        this.isEmpty = this.rows.length === 0;
        /**
         * Casting `total` to a number. Later, we can think of situations
         * to cast it to a bigint
         */
        this.total = Number(this.totalNumber);
        /**
         * Find if there are total records or not. This is not same as
         * `isEmpty`.
         *
         * The `isEmpty` reports about the current set of results. However `hasTotal`
         * reports about the total number of records, regardless of the current.
         */
        this.hasTotal = this.total > 0;
        /**
         * The Last page number
         */
        this.lastPage = Math.max(Math.ceil(this.total / this.perPage), 1);
        /**
         * Find if there are more pages to come
         */
        this.hasMorePages = this.lastPage > this.currentPage;
        /**
         * Find if there are enough results to be paginated or not
         */
        this.hasPages = this.currentPage !== 1 || this.hasMorePages;
    }
    /**
     * A reference to the result rows
     */
    all() {
        return this.rows;
    }
    /**
     * Returns JSON meta data
     */
    getMeta() {
        return {
            total: this.total,
            per_page: this.perPage,
            current_page: this.currentPage,
            last_page: this.lastPage,
            first_page: this.firstPage,
            first_page_url: this.getUrl(1),
            last_page_url: this.getUrl(this.lastPage),
            next_page_url: this.getNextPageUrl(),
            previous_page_url: this.getPreviousPageUrl(),
        };
    }
    /**
     * Returns JSON representation of the paginated
     * data
     */
    toJSON() {
        return {
            meta: this.getMeta(),
            data: this.all(),
        };
    }
    /**
     * Define query string to be appended to the pagination links
     */
    queryString(values) {
        this.qs = values;
        return this;
    }
    /**
     * Define base url for making the pagination links
     */
    baseUrl(url) {
        this.url = url;
        return this;
    }
    /**
     * Returns url for a given page. Doesn't validates the integrity of the
     * page
     */
    getUrl(page) {
        const qs = qs_1.stringify(Object.assign({}, this.qs, { page: page < 1 ? 1 : page }));
        return `${this.url}?${qs}`;
    }
    /**
     * Returns url for the next page
     */
    getNextPageUrl() {
        if (this.hasMorePages) {
            return this.getUrl(this.currentPage + 1);
        }
        return null;
    }
    /**
     * Returns URL for the previous page
     */
    getPreviousPageUrl() {
        if (this.currentPage > 1) {
            return this.getUrl(this.currentPage - 1);
        }
        return null;
    }
    /**
     * Returns an array of urls under a given range
     */
    getUrlsForRange(start, end) {
        let urls = [];
        for (let i = start; i <= end; i++) {
            urls.push({ url: this.getUrl(i), page: i, isActive: i === this.currentPage });
        }
        return urls;
    }
}
exports.SimplePaginator = SimplePaginator;
