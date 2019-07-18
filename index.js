const { send, json } = require('micro')
const cors = require('micro-cors')()
const { router, get, post, put, del } = require('microrouter')

const monk = require('monk')
// DB for the reviews and users
const reviewDb = monk('mongodb://jmullen:Jdogjdog@utah-malpractice-shard-00-00-a4sua.azure.mongodb.net:27017,utah-malpractice-shard-00-01-a4sua.azure.mongodb.net:27017,utah-malpractice-shard-00-02-a4sua.azure.mongodb.net:27017/Reviews?ssl=true&replicaSet=Utah-Malpractice-shard-0&authSource=admin&retryWrites=true&w=majority')
const comment =  reviewDb.get('Posts')

const doctorDb = monk('mongodb://jmullen:Jdogjdog@utah-malpractice-shard-00-00-a4sua.azure.mongodb.net:27017,utah-malpractice-shard-00-01-a4sua.azure.mongodb.net:27017,utah-malpractice-shard-00-02-a4sua.azure.mongodb.net:27017/Doctors?ssl=true&replicaSet=Utah-Malpractice-shard-0&authSource=admin&retryWrites=true&w=majority')
const doctor = doctorDb.get('Doctors')

const getComments = async (req, res) => {
    const results = await comment.find({})
    return send(res, 200, results)
}

const postComment = async (req, res) => {
    const data = await json(req)
    const results = await comment.insert(data)
    return send(res, 201, results)
}

const getOneComment = async (req, res) => {
    const results = await comment.find({_id: req.params.id})
    return send(res, 200, results)
}

const editComment = async (req, res) => {
        const data = await json(req)
        const results = await comment.update({_id: req.params.id}, { $set: { "userName": data.userName, "comment": data.comment, "dateOfIncident": data.dateOfIncident }  }, data)
        return send(res, 200, results)
    }

const deleteComment = async (req, res) => {
    const results = await comment.remove({ _id: req.params.id})
    return send(res, 202, results)
}

const getDoctor = async (req, res) => {
    const results = await doctor.find({})
    return send(res, 200, results)
}

const postDoctor = async (req, res) => {
    const data = await json(req)
    const results = doctor.insert(data)
    return send(res, 201, results)
}

const getOneDoctor = async (req, res) => {
    const results = await doctor.find({_id: req.params.id})
    return send(res, 200, results)
}

// const editDoctor = async (req, res) => {
//     const data = await json(req)
//     const results = doctor.update({_id: req.params.id}, { $set: { "doctorName": data.doctorName, "hospitalName": data.hospitalName, "dateOfIncident": data.dateOfIncident }  }, data)
//     return send(res, 201, results)
// }

const deleteDoctor = async (req, res) => {
    const results = await doctor.remove({ _id: req.params.id })
    return send(res, 202, results)
}

const notFound = (req, res) => send(res, 404, "Looks like you're a little stuck")

module.exports = cors(
    router (
        get('/comments/:id', getOneComment),
        get('/comments', getComments),
        post('/comments', postComment),
        del('/comments/:id', deleteComment),
        put('/comments/:id', editComment),
        get('/doctor/:id', getOneDoctor),
        get('/doctor', getDoctor),
        post('/doctor', postDoctor),
        // put('doctor/:id', editDoctor),
        del('doctor/:id', deleteDoctor),
        get('/*', notFound)
    )
)