const express = require("express");
const router = express.Router();
const con = require("../db/connection");
const jwt = require("jsonwebtoken");

const { check, validationResult } = require("express-validator");
// const axios = require('axios');

// Login a user route : /auth/login

router.post(
    "/login", [
        //validation
        check("email", "email is required").isEmail(),
        check("password", "Enter a password with 6 or more length").isLength({
            min: 6,
        }),
    ],
    (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                error: error.array(),
            });
        }

        // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im10dXNoYXI3OEBnbWFpbC5jb20iLCJ1c2VyX25hbWUiOiJ0dXNoYXIiLCJpYXQiOjE2NTY3NDQ3MTUsImV4cCI6MTY1NzEwNDcxNX0.VbdjTYJn_lqFEVcbWE7Xq6QPiepXl6DtvlbUtr_ew-g";
        // jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTY3NDM5MzgsImV4cCI6MTY1NzEwMzkzOH0.2Hgd8jJLIsq_Xbh7s-p0Ivb5lYaQZtPd7-3fGfD7cB8", 
        // "DIIT18thBatchB&C", function(err, decoded) {
        //     console.log(decoded) // bar
        //   });

        //   jwt.verify(token, 'DIIT18thBatchB&C', function(err, decoded) {
        //     console.log(decoded) // bar
        //   });
        // console.log(decoded)
        let query = `select * from users where email = '${req.body.email}' and password = '${req.body.password}'`;
        // making the db query
        con.query(query,
            (error, result) => {
                if (error) {
                    console.log(error);
                }
                // console.log(typeof(result));
                if (result.length > 0) {
                    // payload is the data passed in, for creating a token
                    const payload = {
                        email: result[0].email,
                        user_name: result[0].user_name,
                    };
                    //Creating a json web token.
                    jwt.sign(
                        payload,
                        "DIIT18thBatchB&C", {
                            expiresIn: 360000,
                        },
                        (err, token) => {
                            if (err) throw err;
                            return res.status(200).json({
                                token: token,
                            });
                        }
                    );
                } else {
                    return res.status(403).json({
                        message: "Unauthorized access!",
                    });
                }
            }
        );
    }
);
// Register a new user
router.post(
    "/register", [
        //validation
        check("email", "email is required").isEmail(),
        check("user_name", "user name is required").notEmpty(),
        check("role", "role is required").notEmpty(),
        check("password", "Enter a password with 6 or more length").isLength({
            min: 6,
        }),
    ],
    (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                error: error.array(),
            });
        }
        let query = `insert into users (email, user_name, role, password) 
                values('${req.body.email}', '${req.body.user_name}', ${req.body.role}, '${req.body.password}')`;
        // making the db query
        con.query(query,
            (error, result) => {
                if (error) {
                    // console.log(error.sqlMessage);
                    return res.status(400).json({
                        message: error.sqlMessage,
                    });
                }
                // console.log((result));
                if (result) {
                    return res.json({
                        message: "user registration is successful!!"
                    })
                } else {
                    return res.status(400).json({
                        message: "unable to create user",
                    });
                }
            }
        );

    }
);
module.exports = router;