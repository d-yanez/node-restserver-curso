const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//cascaron

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'Descripción es requerida']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

//para mejorar mensaje valores únicos
categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
})

module.exports = mongoose.model('Categoria', categoriaSchema);