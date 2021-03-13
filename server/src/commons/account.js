class UserAccount {
    constructor() {
        this.sessionKey = null;
        this.username = "";
        this.password = "";
        this.comment = "";
        this.email = "";
        this.roles = 0; // 0 GUEST | 1 MOD | 2 STUFF | 3 DEV | 4 ADMIN
    }
}

module.exports = UserAccount;