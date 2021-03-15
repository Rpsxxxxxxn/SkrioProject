class Database {
    constructor() {
    }

    insertUserAccount(username, password, email) {
        const sql = `
            INSERT INTO user_db
            VALUES(
                ${username}
            ,   ${password}
            ,   ${email}
            ,   NOW()
            ,   NOW()
            ,   0
            )
        `;
        this.execute(sql);
    }

    getUserAccount(username, password) {
        const sql = `
            SELECT
                nickname as NickName
            ,   password as PassWord
            ,   email as Email
            FROM
                user_db
            WHERE
                nickname = ${username}
            AND password = ${password}
        `;

        this.execute(sql);
    }

    execute(query) {

    }
}

module.exports = Database;