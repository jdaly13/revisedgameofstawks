'use strict';
const express = require('express');


const router = new express.Router();

router.get('/dashboard', (req, res) => {
	//console.log('response ', res.data);
  res.status(200).json({
    message: res.data.email,
		data: res.data
  });
});


module.exports = router;