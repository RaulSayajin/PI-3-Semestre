const AppError = require('../utils/AppError');

class UpdateAvaliacaoDTO {
  constructor(data) {
    this.nota = data.nota;
    this.comentario = data.comentario;

    this.validate();
  }

  validate() {
    // Nota é opcional na atualização, mas se fornecida deve ser válida
    if (this.nota !== undefined && (this.nota < 1 || this.nota > 5)) {
      throw new AppError('A nota deve ser entre 1 e 5.', 400);
    }

    // Comentário é opcional, mas se fornecido não pode ser vazio
    if (this.comentario !== undefined && this.comentario.trim().length === 0) {
      throw new AppError('O comentário não pode estar vazio.', 400);
    }

    // Se comentário for fornecido, limitar o tamanho
    if (this.comentario && this.comentario.length > 500) {
      throw new AppError('O comentário não pode ter mais de 500 caracteres.', 400);
    }

    // Garantir que pelo menos um campo seja fornecido para atualização
    if (this.nota === undefined && this.comentario === undefined) {
      throw new AppError('Pelo menos um campo (nota ou comentário) deve ser fornecido para atualização.', 400);
    }
  }

  toObject() {
    const obj = {};
    
    if (this.nota !== undefined) obj.nota = this.nota;
    if (this.comentario !== undefined) obj.comentario = this.comentario;
    
    return obj;
  }
}

module.exports = UpdateAvaliacaoDTO;