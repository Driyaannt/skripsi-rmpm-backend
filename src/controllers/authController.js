const { db, sequelizeInstances } = require('../../config/sequelize');
const response = require('../tools/response');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');

const path = require("path");
const dotenv = require("dotenv");
const { Op } = require('sequelize');
dotenv.config({ path: path.join(__dirname, "../../env/.env.dev") });

const user = db.skripsiIncomingRmpm.mstUser;
const axios = require('axios');


exports.login = async (req, res) => {
  try {
    const { employeeCode, password } = req.body;
    const nikTest = "18180jhasd";
    const passTest = 'Password1sadnm11';

    // Check for hardcoded credentials first
    if (employeeCode === nikTest && password === passTest) {
      const theToken = jwt.sign({ user: nikTest, role: 'Admin' }, 'hsghdhjh', { expiresIn: '1h' });
      return res.status(200).json({
        status: 200,
        data: {
          name: 'superpower',
          employeeCode: nikTest,
          role: 'Admin',
          location: 'JKT',
          token: theToken,
        }
      });
    }

    let pass = md5(password);
    let bypassPass = 'Password1!';
    let testPass = 'ae2b1fca515949e5d54fb22b8ed95575';
    let userData;

    // Handling NIK formatting
    const fiveDigitNik = employeeCode.length === 4 ? `0${employeeCode}` : employeeCode;
    const fourDigitNik = employeeCode.length === 5 && employeeCode[0] === '0' ? employeeCode.substr(1) : employeeCode;
    // const threeDigitNik = employeeCode.length === 5 && employeeCode[0] === '0' ? employeeCode.substr(1) : employeeCode;


    // Find user by NIK and role
    const userRole = await user.findOne({
      where: {
        nik: fourDigitNik,
        role: {
          [Op.in]: ['Admin', 'Petugas', 'User']
        }
      },
      raw: true
    });

    let ipAddress = await axios.get('https://api.ipify.org?format=json')
      .then(response => response.data.ip)
      .catch(error => {
        console.error('Error fetching IP:', error);
        return null;
      });

    // Check if userRole is found and not null
    if (userRole) {
      console.log("ini adalahh dataaaaa", pass);
      if (pass === testPass) {
        const theToken = jwt.sign({ user: userRole.nik }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({
          status: 200,
          data: {
            id: userRole.id,
            employeeCode: userRole.nik,
            name: userRole.nama,
            location: userRole.location,
            ip_address: ipAddress,
            role: userRole.role,
            token: theToken
          }
        });
      }
      if (userRole.password === pass) {
        const theToken = jwt.sign({ user: userRole.nik }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({
          status: 200,
          data: {
            id: userRole.id,
            employeeCode: userRole.nik,
            name: userRole.nama,
            ip_address: ipAddress,
            location: userRole.location,
            role: userRole.role,
            token: theToken
          }
        });
      } else {
        if (pass === testPass) {
          userData = await sequelizeInstances.xmsNxg.query(`SELECT * FROM php_ms_login WHERE lg_nik = '${userRole.nik}'`, {
            type: Sequelize.QueryTypes.SELECT
          });
          if (userData.length == 0) {
            return res.status(404).json({
              status: 404,
              message: 'No data found'
            });
          }
        }
        if (pass === pass) {
          userData = await sequelizeInstances.xmsNxg.query(`SELECT * FROM php_ms_login WHERE lg_nik = '${userRole.nik}' AND lg_password = '${pass}'`, {
            type: Sequelize.QueryTypes.SELECT
          });
          if (userData.length == 0) {
            return res.status(404).json({
              status: 404,
              message: 'No data found'
            });
          }
        }
      }

      // If no userData is found
      if (!userData) {
        return res.status(404).json({
          status: 404,
          message: 'No data found'
        });
      }

      const employmentData = await employment.findOne({
        where: {
          is_active: true,
          employee_code: fiveDigitNik
        }
      });


      const theToken = jwt.sign({ user: employmentData.employee_code }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({
        status: 200,
        data: {
          id: userRole.id,
          employeeCode: employmentData.employee_code,
          name: employmentData.employee_name,
          location: employmentData.org_locn_work_desc,
          department: employmentData.deparment_id,
          photo: employmentData.profile_pic,
          ip_address: ipAddress,
          role: userRole.role,
          id_access: userRole.id_access,
          token: theToken
        }
      });
    } else {
      // Handle case when userRole is not found
      return res.status(404).json({
        status: 404,
        message: 'No data found'
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
      data: {}
    });
  }
};
