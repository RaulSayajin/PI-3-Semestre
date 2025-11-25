export const getStarRating = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`text-2xl ${
          i <= rating ? "text-yellow-400" : "text-gray-600"
        }`}
      >
        ★
      </span>
    );
  }
  return stars;
};

export const formatDate = (timestamp) => {
  if (!timestamp) return "Recentemente";
  const date = new Date(timestamp);
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatCount = (count) => {
  if (!count) return 0;
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return count;
};