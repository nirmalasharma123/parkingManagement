const joi = require("joi")

const userValidationSchema = joi.object({

  name: joi.string().required(),
  phoneNo: joi
    .string()
    .required()
    .trim()
    .regex(/^[6-9][0-9]{9}$/),
  email: joi
    .string()
    .required()
    .regex(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/),
  password: joi
    .string()
    .required()
    .min(8)
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    ),
});

const logiValidation =joi.object({

   email: joi
  .string()
  .trim()
  .required(),

   password: joi
  .string()
  .required()
  .min(8),
});


module.exports= {userValidationSchema,logiValidation};