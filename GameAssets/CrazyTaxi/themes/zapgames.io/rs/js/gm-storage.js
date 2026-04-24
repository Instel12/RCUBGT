class GMStorage {
    constructor(key = 'Zapgames.io_game') {
        this.key = key;
        this.arrayFavoritesStorage = [];
        this.limit = 28;
        this.arrayLikesStorage = [];
        this.arrayDislikesStorage = [];
        this.arrayRecentStorage = []
        this.load();
    }

    load = () => {
        let t = localStorage.getItem(this.key) ? JSON.parse(localStorage.getItem(this.key)) : null;
        if (t) {
            this.arrayFavoritesStorage = Array.isArray(t.arrayFavoritesStorage) ? t.arrayFavoritesStorage : [];
            this.arrayLikesStorage = Array.isArray(t.arrayLikesStorage) ? t.arrayLikesStorage : [];
            this.arrayDislikesStorage = Array.isArray(t.arrayDislikesStorage) ? t.arrayDislikesStorage : [];
            this.arrayRecentStorage = Array.isArray(t.arrayRecentStorage) ? t.arrayRecentStorage : [];
        }
        return this;
    }

    save = () => {
        return localStorage.setItem(this.key, JSON.stringify(this))
    }

    get = () => {
        return localStorage.getItem(this.key) || null;
    }

    clear = () => {
        localStorage.removeItem(this.key);
    }

    addFavoritesGame = (objgame) => {
        const slug = objgame.slug;
        const index = this.arrayFavoritesStorage.findIndex(item => item.slug === slug);

        if (index !== -1) {
            this.arrayFavoritesStorage[index] = objgame;
        } else {
            this.arrayFavoritesStorage.push(objgame);
            this.arrayFavoritesStorage = this.arrayFavoritesStorage.slice(-this.limit);
        }
        this.save();
    }

    removeFavoritesGame = (game_slug) => {
        const index = this.arrayFavoritesStorage.findIndex(item => item.slug === game_slug);
        if (index !== -1) {
            this.arrayFavoritesStorage.splice(index, 1);
            this.save();
        }
    }

    checkGameFavoritesExist = (game_slug) => {
        return this.arrayFavoritesStorage.some(t => t.slug === game_slug);
    }

    addLikeGame = (objgame) => {
        const slug = objgame.slug;
        const index = this.arrayLikesStorage.findIndex(item => item.slug === slug);

        if (index !== -1) {
            this.arrayLikesStorage[index] = objgame;
        } else {
            this.arrayLikesStorage.push(objgame);
            this.arrayLikesStorage = this.arrayLikesStorage.slice(-this.limit);
        }
        this.save();
    }

    removeLikeGame = (game_slug) => {
        const index = this.arrayLikesStorage.findIndex(item => item.slug === game_slug);
        if (index !== -1) {
            this.arrayLikesStorage.splice(index, 1);
            this.save();
        }
    }

    checkGameLikeExist = (game_slug) => {
        return this.arrayLikesStorage.some(t => t.slug === game_slug);
    }

    addDislikeGame = (game_slug) => {
        if (!this.arrayDislikesStorage.includes(game_slug)) {
            this.arrayDislikesStorage.push(game_slug)
            this.save();
        }
    }

    removeDislikeGame = (game_slug) => {
        const index = this.arrayDislikesStorage.indexOf(game_slug);
        if (index !== -1) {
            this.arrayDislikesStorage.splice(index, 1);
            this.save();
        }
    }

    hasLikeGame = (game_slug) => {
        return this.checkGameLikeExist(game_slug);
    }

    hasDislikeGame = (game_slug) => {
        return this.arrayDislikesStorage.includes(game_slug);
    }

    addRecentGame = (objgame) => {
        const slug = objgame.slug;
        const index = this.arrayRecentStorage.findIndex(item => item.slug === slug);

        if (index !== -1) {
            this.arrayRecentStorage[index] = objgame;
        } else {
            this.arrayRecentStorage.push(objgame);
            this.arrayRecentStorage = this.arrayRecentStorage.slice(-this.limit);
        }
        this.save();
    }

    removeRecentGame = (game_slug) => {
        const index = this.arrayRecentStorage.findIndex(item => item.slug === game_slug);
        if (index !== -1) {
            this.arrayRecentStorage.splice(index, 1);
            this.save();
        }
    }

    checkGameRecentExist = (game_slug) => {
        return this.arrayRecentStorage.some(t => t.slug === game_slug);
    }
}