const db = require("../data/dbConfig");

const add = async (user) => {
    const [id] = await db("user").insert(user);

    return db("user").where({id}).first();
};

const remove = (id) => {
    return db("user").where({id}).del();
};

const find = () => {
    return db("user").select("id", "username");
};

const findById = (id) => {
    return db("user").where({id}).select("id", "username");
};

const findBy = (filter) => {
    return db("user").where(filter).select("username", "password");
}

module.exports = {
    add,
    remove,
    find,
    findById,
    findBy
};