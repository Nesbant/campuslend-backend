const { Router } = require('express');
const {
  getInstitutionsData,
} = require('../controllers/institutions.controller');

const router = Router();

router.get('/', getInstitutionsData);

module.exports = router;
