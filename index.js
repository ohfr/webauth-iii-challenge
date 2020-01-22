const express = require("express");

const cors = require("cors");

const PORT = process.env.PORT || 5000;

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const db = require("./dbHelpers/users");

const secrets = require("./Secrets/index");

const server = express();

server.use(express.json());
server.use(cors());

const verifyToken = async (req, res, next) => {    
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, secrets.jwtSecret);
        req.decoded = decoded.subject;
      next();
    } catch(err) {
        next(err);
    }
}

const generateToken = (user) => {
    const payload = {
        subject: user.id,
        username: user.username,
    };

    const options = {
        expiresIn: '1d'
    };

    return jwt.sign(payload, secrets.jwtSecret, options);
}


server.post("/api/register", async (req, res, next) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 12);
        res.status(201).json(await db.add(req.body));
    } catch(err) {
        next(err);
    }
});

server.post("/api/login", async(req, res, next) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ message: "Missing credentials "})
        }
        const { username, password } = req.body;
        const user = await db.findBy({ username })

        const passwordValid = bcrypt.compareSync(password, user.password);

        if (user && passwordValid) {
            const token = generateToken(user);
            res.status(200).json({ message: "Logged in", token })
        } else {
            res.status(401).json({ message: "Invalid Credentials" });
        }
    } catch(err) {
        next(err);
    }
});

server.get("/api/users", verifyToken, async (req, res, next) => {
    try {
        res.json(await db.find());
    } catch(err) {
        next(err);
    }
});


server.use((err, req, res, next) => {
    console.log(err);

    res.status(500).json({message: "Something went wrong"});
});

server.listen(PORT, () => {
    console.log(`\n *** Server running on port:${PORT} *** \n`);
});