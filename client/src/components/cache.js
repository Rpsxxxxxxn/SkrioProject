export class Cache {
    constructor() {
        this.data = new Map();
    }

    /**
     * データを設定します
     * @param {*} key 
     * @param {*} data 
     */
    setData(key, data) {
        this.data.set(key, data);
    }

    /**
     * データを取得します
     * @param {*} key 
     */
    getData(key) {
        return this.data.get(key);
    }

    /**
     * データを削除します
     * @param {*} key 
     */
    erase(key) {
        this.data.delete(key);
    }

    /**
     * データを全て削除します
     */
    cleanup() {
        this.data.clear();
    }
}