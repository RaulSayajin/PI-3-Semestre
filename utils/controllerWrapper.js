/**
 * Wrapper para funções de controller assíncronas.
 * Captura erros e os passa para o próximo middleware (error handler)
 * @param {Function} fn - A função de controller assíncrona.
 * @returns {Function} Uma nova função que lida com a promessa.
 */
const controllerWrapper = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = controllerWrapper;