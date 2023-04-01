import { createRequire } from 'module';

//import * as Joi from 'joi'
const require = createRequire(import.meta.url);
const Joi = require('joi')

export const orderSchema = Joi.object({
    customerId: Joi.number().required(),
    paymentId: Joi.number().optional(),
    dispatchId: Joi.number().optional(),
    shopId: Joi.number().optional(),
    invoiceAmount: Joi.number().optional(),
    orderTime: Joi.string().required(),
    transactionId: Joi.string().optional({nullable: true}),
    comment: Joi.string().optional({nullable: true}),
    isTaxFree: Joi.boolean().required(),
    trackingCode: Joi.string().optional({nullable: true}),
    currency: Joi.string().optional({nullable: true}),
    paymentStatusId: Joi.number().required(),
    orderStatusId: Joi.number().required()
})
