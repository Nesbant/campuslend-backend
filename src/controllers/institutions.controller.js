const { Institution, Campus, Major } = require('../../models');

async function getInstitutionsData(req, res, next) {
  try {
    const institutions = await Institution.findAll({
      include: [
        {
          model: Campus,
          as: 'campuses',
          include: [
            {
              model: Major,
              as: 'majors',
            },
          ],
        },
      ],
      order: [
        ['name', 'ASC'],
        [{ model: Campus, as: 'campuses' }, 'name', 'ASC'],
        [
          { model: Campus, as: 'campuses' },
          { model: Major, as: 'majors' },
          'name',
          'ASC',
        ],
      ],
    });
    res.json({ success: true, data: institutions });
  } catch (error) {
    next(error);
  }
}

module.exports = { getInstitutionsData };
