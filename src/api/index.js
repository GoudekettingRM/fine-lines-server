const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/verify', async (req, res) => {
  const { token } = req.body;
  const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GRECAPTCHA_SECRET}&response=${token}`;

  const { data } = await axios.post(
    recaptchaUrl,
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    },
  );

  if (data.success && data.score >= 0.5) {
    return res.json({ status: 'OK', message: 'Captcha Passed' });
  }

  return res.status(406).send({
    status: 'FAILED',
    message: 'Captcha failed. Reload and try again. ',
    errors: data['error-codes'],
  });
});

module.exports = router;
