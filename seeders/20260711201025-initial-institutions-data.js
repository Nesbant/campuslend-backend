'use strict';

const INSTITUTIONS_DATA = {
  'Pontificia Universidad Católica del Perú (PUCP)': {
    'Campus San Miguel (Principal)': [
      'Arquitectura',
      'Arte y Diseño',
      'Ciencias e Ingeniería',
      'Ciencias Sociales',
      'Comunicaciones',
      'Derecho',
      'Economía',
      'Gestión',
      'Psicología',
    ],
    'Centrum (Surco)': [
      'Administración de Negocios (Posgrado)',
      'Finanzas (Posgrado)',
    ],
  },
  'Universidad Nacional Mayor de San Marcos (UNMSM)': {
    'Ciudad Universitaria': [
      'Ingeniería de Sistemas',
      'Ingeniería Industrial',
      'Derecho',
      'Economía',
      'Administración',
      'Contabilidad',
      'Letras',
      'Matemática',
      'Biología',
    ],
    'San Fernando (Facultad de Medicina)': [
      'Medicina Humana',
      'Enfermería',
      'Nutrición',
      'Tecnología Médica',
      'Obstetricia',
    ],
  },
  'Universidad Nacional de Ingeniería (UNI)': {
    'Campus Central (Rímac)': [
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Ingeniería de Sistemas',
      'Ingeniería Mecánica',
      'Ingeniería Eléctrica',
      'Arquitectura',
      'Ingeniería Química',
      'Ciencias de la Computación',
    ],
  },
  'Universidad Peruana de Ciencias Aplicadas (UPC)': {
    Monterrico: [
      'Ingeniería de Software',
      'Ingeniería de Sistemas',
      'Comunicaciones',
      'Economía',
      'Administración',
      'Arquitectura',
    ],
    'San Isidro': [
      'Negocios Internacionales',
      'Marketing',
      'Administración y Finanzas',
    ],
    'San Miguel': [
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Derecho',
      'Contabilidad',
    ],
    Villa: [
      'Medicina',
      'Odontología',
      'Nutrición',
      'Terapia Física',
      'Psicología',
      'Arquitectura',
    ],
  },
  'Universidad de Lima (ULima)': {
    'Campus Monterrico': [
      'Arquitectura',
      'Comunicación',
      'Derecho',
      'Economía',
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Ingeniería de Sistemas',
      'Negocios Internacionales',
      'Psicología',
    ],
  },
  'Universidad de San Martín de Porres (USMP)': {
    'Pueblo Libre': ['Derecho', 'Odontología'],
    'San Isidro': [
      'Ciencias de la Comunicación',
      'Turismo y Hotelería',
      'Psicología',
    ],
    'Santa Anita': [
      'Ciencias Administrativas y Recursos Humanos',
      'Ciencias Contables',
      'Ingeniería y Arquitectura',
    ],
  },
  'Universidad Tecnológica del Perú (UTP)': {
    'Lima Centro': [
      'Ingeniería de Sistemas',
      'Ingeniería Industrial',
      'Administración',
      'Derecho',
      'Psicología',
      'Arquitectura',
    ],
    'Lima Norte (Los Olivos)': [
      'Ingeniería Civil',
      'Ingeniería de Sistemas',
      'Administración',
      'Contabilidad',
    ],
    'Lima Sur (VES)': [
      'Ingeniería Industrial',
      'Administración',
      'Ingeniería Mecatrónica',
      'Psicología',
    ],
    'Lima Este (SJL)': [
      'Ingeniería de Sistemas',
      'Ingeniería Industrial',
      'Administración',
      'Derecho',
    ],
    Ate: [
      'Ingeniería Civil',
      'Ingeniería de Sistemas',
      'Administración',
      'Contabilidad',
    ],
  },
  'Universidad Privada del Norte (UPN)': {
    Breña: [
      'Administración',
      'Derecho',
      'Ingeniería Industrial',
      'Arquitectura',
    ],
    Chorrillos: [
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Administración',
      'Psicología',
    ],
    Comas: [
      'Ingeniería Civil',
      'Ingeniería de Sistemas',
      'Contabilidad',
      'Psicología',
    ],
    'Los Olivos': [
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Administración',
      'Derecho',
    ],
    'San Juan de Lurigancho': [
      'Ingeniería Industrial',
      'Ingeniería de Sistemas',
      'Administración',
      'Derecho',
    ],
  },
  'Universidad César Vallejo (UCV)': {
    Ate: [
      'Administración',
      'Contabilidad',
      'Derecho',
      'Ingeniería Civil',
      'Ingeniería de Sistemas',
      'Psicología',
    ],
    Callao: [
      'Administración',
      'Contabilidad',
      'Derecho',
      'Ingeniería de Sistemas',
    ],
    'Los Olivos': [
      'Administración',
      'Arquitectura',
      'Derecho',
      'Ingeniería Civil',
      'Ingeniería de Sistemas',
      'Psicología',
      'Enfermería',
    ],
    'San Juan de Lurigancho': [
      'Administración',
      'Contabilidad',
      'Derecho',
      'Ingeniería Civil',
      'Ingeniería de Sistemas',
      'Psicología',
    ],
  },
  'Universidad Científica del Sur (UCSUR)': {
    Ate: ['Medicina Humana', 'Psicología', 'Nutrición', 'Obstetricia'],
    'Los Olivos (Norte)': [
      'Medicina Humana',
      'Psicología',
      'Nutrición',
      'Enfermería',
    ],
    'Villa (Chorrillos)': [
      'Medicina Veterinaria',
      'Biología Marina',
      'Medicina Humana',
      'Nutrición',
      'Psicología',
      'Ingeniería Ambiental',
      'Arquitectura',
    ],
  },
  'Universidad del Pacífico (UP)': {
    'Campus Jesús María': [
      'Economía',
      'Administración',
      'Finanzas',
      'Contabilidad',
      'Ingeniería de la Información',
      'Ingeniería Empresarial',
      'Derecho',
    ],
  },
  'Universidad ESAN': {
    'Campus Surco': [
      'Administración y Finanzas',
      'Economía y Negocios',
      'Ingeniería de Tecnologías de Información',
      'Derecho Corporativo',
      'Ingeniería Industrial',
    ],
  },
  'Universidad Nacional Agraria La Molina (UNALM)': {
    'Campus La Molina': [
      'Agronomía',
      'Biología',
      'Ingeniería Ambiental',
      'Industrias Alimentarias',
      'Zootecnia',
      'Economía',
      'Ingeniería Agrícola',
      'Ingeniería Forestal',
    ],
  },
  'Universidad Nacional Federico Villarreal (UNFV)': {
    'Centro de Lima (Central)': [
      'Derecho',
      'Ciencias Políticas',
      'Educación',
      'Ciencias Sociales',
    ],
    'El Agustino': ['Medicina', 'Tecnología Médica', 'Nutrición'],
    'Pueblo Libre': ['Odontología', 'Psicología'],
    'San Miguel': [
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Ingeniería de Sistemas',
      'Arquitectura',
    ],
  },
  'Universidad Peruana Cayetano Heredia (UPCH)': {
    'Campus Central (SMP)': [
      'Medicina',
      'Estomatología',
      'Enfermería',
      'Tecnología Médica',
      'Ciencias',
    ],
    'La Molina': ['Veterinaria', 'Biología', 'Ingeniería Ambiental'],
    Miraflores: ['Psicología', 'Salud Pública', 'Administración en Salud'],
  },
  'Universidad Ricardo Palma (URP)': {
    'Campus Surco': [
      'Arquitectura',
      'Ingeniería Civil',
      'Medicina Humana',
      'Psicología',
      'Traducción',
      'Ingeniería Informática',
      'Medicina Veterinaria',
    ],
  },
  'Universidad San Ignacio de Loyola (USIL)': {
    'La Molina': [
      'Administración',
      'Arte y Diseño',
      'Gastronomía',
      'Ingeniería Industrial',
      'Negocios Internacionales',
      'Comunicaciones',
    ],
    Magdalena: ['Administración', 'Marketing', 'Negocios Internacionales'],
    Pachacámac: ['Gastronomía', 'Industrias Alimentarias'],
  },
  Cibertec: {
    Ate: [
      'Administración',
      'Computación e Informática',
      'Contabilidad',
      'Diseño Gráfico',
    ],
    Bellavista: ['Administración', 'Computación e Informática', 'Mecatrónica'],
    Breña: ['Administración', 'Diseño de Interiores', 'Redes y Comunicaciones'],
    Independencia: ['Computación e Informática', 'Contabilidad', 'Logística'],
    Miraflores: [
      'Diseño Gráfico',
      'Traducción',
      'Marketing',
      'Comunicación Audiovisual',
    ],
    'San Juan de Lurigancho': [
      'Administración',
      'Computación e Informática',
      'Contabilidad',
    ],
    'San Miguel': ['Diseño Gráfico', 'Computación e Informática', 'Marketing'],
  },
  IDAT: {
    'Centro de Lima': [
      'Administración',
      'Desarrollo de Software',
      'Diseño de Interiores',
      'Mecatrónica',
    ],
    Surco: [
      'Administración',
      'Marketing',
      'Desarrollo de Sistemas de Información',
    ],
    'Independencia (Tomas Valle)': [
      'Desarrollo de Software',
      'Mecatrónica Automotriz',
      'Diseño Gráfico',
    ],
  },
  ISIL: {
    Miraflores: [
      'Comunicación Integral',
      'Marketing',
      'Diseño Gráfico',
      'Desarrollo de Software',
    ],
    'San Isidro': [
      'Administración y Finanzas',
      'Negocios Internacionales',
      'Marketing',
    ],
    'La Molina': [
      'Administración',
      'Comunicación Audiovisual',
      'Diseño de Interiores',
      'Sistemas de Información',
    ],
  },
  Senati: {
    Ate: [
      'Mecatrónica Automotriz',
      'Diseño Gráfico',
      'Ingeniería de Software',
      'Electrotecnia',
    ],
    'Cercado de Lima': [
      'Mecatrónica Automotriz',
      'Diseño Gráfico',
      'Administración Industrial',
    ],
    'Independencia (Sede Central)': [
      'Mecatrónica Automotriz',
      'Ingeniería de Software',
      'Electrotecnia',
      'Diseño Gráfico',
      'Administración Industrial',
    ],
    'San Juan de Lurigancho': [
      'Mecatrónica Automotriz',
      'Administración Industrial',
      'Diseño Gráfico',
    ],
    Surquillo: [
      'Diseño Gráfico',
      'Ingeniería de Software',
      'Administración Industrial',
    ],
  },
  TECSUP: {
    'Campus Lima (Santa Anita)': [
      'Mantenimiento de Maquinaria',
      'Diseño de Software',
      'Redes y Comunicaciones',
      'Electrotecnia',
      'Mecatrónica',
    ],
  },
  'Toulouse Lautrec': {
    'Chacarilla (Surco)': [
      'Diseño Gráfico',
      'Dirección y Diseño Gráfico',
      'Animación Digital',
      'Diseño de Interiores',
      'Comunicación Audiovisual',
    ],
    'Javier Prado (San Isidro)': [
      'Diseño Gráfico',
      'Diseño de Interiores',
      'Marketing',
    ],
    'Lima Norte (Independencia)': [
      'Diseño Gráfico',
      'Animación Digital',
      'Diseño de Interiores',
    ],
    'San Miguel': [
      'Diseño Gráfico',
      'Comunicación Audiovisual',
      'Diseño de Interiores',
    ],
  },
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (const institutionName of Object.keys(INSTITUTIONS_DATA)) {
      const [institution] = await queryInterface.bulkInsert('Institutions', [{
        name: institutionName,
        createdAt: new Date(),
        updatedAt: new Date(),
      }], { returning: ['id'] });

      const campuses = INSTITUTIONS_DATA[institutionName];
      for (const campusName of Object.keys(campuses)) {
        const [campus] = await queryInterface.bulkInsert('Campuses', [{
          name: campusName,
          institutionId: institution.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }], { returning: ['id'] });

        const majors = campuses[campusName].map(majorName => ({
          name: majorName,
          campusId: campus.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        if (majors.length > 0) {
          await queryInterface.bulkInsert('Majors', majors, {});
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Majors', null, {});
    await queryInterface.bulkDelete('Campuses', null, {});
    await queryInterface.bulkDelete('Institutions', null, {});
  },
};
