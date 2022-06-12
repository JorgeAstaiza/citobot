const { response, request } = require('express');
const { pool } = require('../database/config');

const respuesta = (res, err, results) => {
    if (err) {
        res.json({
            codigoRespuesta: -1,
            descripcionRespuesta: "Error",
            objetoRespuesta: []
        });
    } else {
        res.json({
            codigoRespuesta: 0,
            descripcionRespuesta: "Exito",
            objetoRespuesta: results
        });
    }
}

const obtenerUsuarios = async(req = request, res = response) => {
    await pool.query('SELECT p.per_identificacion, p.per_tip_id, p.per_primer_nombre, p.per_otros_nombres, p.per_primer_apellido, p.per_segundo_apellido, g.gen_nombre, u.usu_usuario, u.usu_email, pro.pro_nombre, u.usu_rol, u.usu_estado FROM usuario u INNER JOIN profesion pro on (u.usu_pro_id = pro.pro_id) INNER JOIN persona p on (u.usu_per_identificacion = p.per_identificacion) INNER JOIN genero g on (p.per_gen_id = g.gen_id);', function(err, result){
        respuesta(res, err, result)
    });
}

const crearUsuario = async(req = request, res = response) => {
    console.log(req.body);
    const { usu_per_identificacion, usu_usuario, usu_clave, usu_email, usu_pro_id, usu_rol, usu_estado } = req.body;

    await pool.query(`INSERT INTO usuario (usu_per_identificacion, usu_usuario, usu_clave, usu_email, usu_pro_id, usu_rol, usu_estado) VALUES ( "${usu_per_identificacion}", "${usu_usuario}", "${usu_clave}", "${usu_email}", ${usu_pro_id}, "${usu_rol}", "${usu_estado}");`, function(err, result){
        respuesta(res, err, result)
    });
}


const actualizarUsuario = async(req = request, res = response) => {
    const { id } = req.params
    const { usu_usuario, usu_clave, usu_email, usu_pro_id, usu_rol } = req.body;

    await pool.query(`UPDATE usuario SET usu_usuario="${usu_usuario}", usu_clave="${usu_clave}", usu_email="${usu_email}", usu_pro_id=${usu_pro_id}, usu_rol="${usu_rol}" WHERE usu_per_identificacion=${id};`, function(err, result){
        respuesta(res, err, result)
    });
}

const actualizarEstadoUsuario = async(req = request, res = response) => {
    const { id } = req.params
    const { usu_estado } = req.body;

    await pool.query(`UPDATE usuario SET usu_estado="${usu_estado}" WHERE usu_per_identificacion=${id};`, function(err, result){
        respuesta(res, err, result)
    });
}
module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    actualizarEstadoUsuario
}