import { createRequire } from 'module';
import { createValidator } from 'express-joi-validation'
import express from 'express';
import fetch from 'node-fetch';
import { orderSchema } from '../schema/order.js'
import { query, validationResult } from 'express-validator';

const require = createRequire(import.meta.url);
const bodyParser = require("body-parser"); 
const { OAuth2Server } = require('oauth2-mock-server');
const app = express();
const validator = createValidator()
const baseUrl = 'https://anypoint.mulesoft.com/mocking/api/v1/links/0c6f57df-59b5-4193-8534-d7a72b251dc8';
const apiSegment = 'Orders API: ';
const Joi = require('joi');
// For now mocking the access token for the api
let server = new OAuth2Server();
await server.issuer.keys.generate('RS256');
await server.start(8080, 'localhost');
// Build a new token
let token = await server.issuer.buildToken();

export const orderRouter =
    app.use(bodyParser.json()); 
    // this method attempts to get orders from the mulesoft api
    app.get(
            '/orders', 
            query('orderId').isInt().optional({nullable: true}), 
            async (req, res) => {
                try {
                    validationResult(req).throw();
                    const response = await fetch(
                        `${baseUrl}/orders`,
                        {
                            method: "get",
                            headers: {
                                "Content-type": "application/json",
                                "accessToken": token
                            }
                        }
                    );
                
                    if (!response.ok) {
                        throw new Error(apiSegment + `HTTP error! status ${response.status}`);
                    }

                    // from here we can put additional logic if the raw response need some processing.
                
                    const data = await response.json();
                    res.send(data);
                } catch (err) {
                    res.status(400).json({ error: `There was an error creating the order. ${err.message}` });
                }
            }
        )

    // this method attempts to create orders from the mulesoft api
    app.post(
        '/orders', 
        validator.body(orderSchema),
        async (req, res) => {
            //If we need to process the order received from the api, we can process it from here.
            try {
                const response = await fetch(
                    `${baseUrl}/orders`,
                    {
                        method: "post",
                        headers: {
                            "Content-type": "application/json",
                            "accessToken": token
                        },
                        body: JSON.stringify(req.body)
                    }
                );
            
                if (!response.ok) {
                    throw new Error(`${apiSegment} HTTP error! status ${response.status}`);
                }
            
                const data = await response.json();
                res.send(data);
            } catch (err) {
                res.status(400).json({ error: `There was an error creating the order. ${err.message}`});
            }
        }
    )

    // this method attempts to delete orders from the mulesoft api. We need to pass in order ID. If not this will not work.
    app.put(
        '/orders', 
        query('orderId').trim().isInt().not().isEmpty(), 
        async (req, res) => {
            try {
                validationResult(req).throw();
                const orderId = req.query.orderId;
                const response = await fetch(
                    `${baseUrl}/orders`,
                    {
                        method: "put",
                        headers: {
                            "Content-type": "application/json",
                            "accessToken": token
                        },
                        body: JSON.stringify(req.body)
                    }
                );
            
                if (!response.ok) {
                    throw new Error(`${apiSegment} HTTP error! status ${response.message}`);
                }
            
                const data = await response.json();
                res.send(data);
            } catch (err) {
                res.status(400).json({ error: `There was an error deleting the order. ${err.message}`});
            }
        }
    )

    app.use((err, req, res, next) => {
        if (err && err.error && err.error.isJoi) {
        // we had a joi error, let's return a custom 400 json response
        res.status(400).json({
            type: err.type, // will be "query" here, but could be "headers", "body", or "params"
            message: `${apiSegment}` + err.error.toString()
        });
        } else {
        // pass on to another error handler
        next(err);
        }
    });

