/**
 * Classe de erro customizada para a aplicação.
 * Permite a criação de erros com um status code HTTP e uma mensagem clara.
 * @extends Error
 */
class AppError extends Error {
  /**
   * @param {string} message - A mensagem de erro.
   * @param {number} statusCode - O código de status HTTP associado ao erro.
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Erros operacionais, que são esperados

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;