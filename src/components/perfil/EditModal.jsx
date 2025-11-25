import React, { useState, useEffect } from "react";

export default function EditModal({ review, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nota: review?.nota || 0,
    comentario: review?.comentario || ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (review) {
      setFormData({
        nota: review.nota,
        comentario: review.comentario
      });
    }
  }, [review]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.nota < 1 || formData.nota > 5) {
      alert("A nota deve ser entre 1 e 5");
      return;
    }

    setLoading(true);
    try {
      await onSave(review._id, formData);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-purple-500">
        <h3 className="text-white text-xl font-bold mb-4">Editar Avaliação</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-white block mb-2">Nota:</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, nota: star }))}
                  className={`text-2xl ${star <= formData.nota ? "text-yellow-400" : "text-gray-600"} hover:text-yellow-300 transition-colors`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-1">
              Nota atual: {formData.nota}/5
            </p>
          </div>

          <div className="mb-4">
            <label className="text-white block mb-2">Comentário:</label>
            <textarea
              value={formData.comentario}
              onChange={(e) => setFormData(prev => ({ ...prev, comentario: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
              rows="4"
              placeholder="Digite seu comentário..."
              maxLength={500}
            />
            <p className="text-gray-400 text-sm mt-1">
              {formData.comentario.length}/500 caracteres
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}