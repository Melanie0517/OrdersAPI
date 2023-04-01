import { createRequire } from 'module';
import express from 'express';
import { orderRouter } from './routes/order.js'

//import * as Joi from 'joi'
const require = createRequire(import.meta.url);
const app = express();

app.use(orderRouter); 
app.listen(8081, () => {
    console.log('Example app listening on port 8081!')
})
