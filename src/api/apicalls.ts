const apikey: string = '28f90adcc04d870a4b795c7a54051509';
export const baseImagePath = (size: string, path: string) => {
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
export const nowPlayingMovies: string = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apikey}&&language=vi-VN`;
export const upcomingMovies: string = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apikey}&&language=vi-VN`;
export const popularMovies: string = `https://api.themoviedb.org/3/movie/popular?api_key=${apikey}&&language=vi-VN`;
export const topRatedMovies: string = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apikey}&&language=vi-VN`;
export const searchMovies = (keyword: string) => {
  return `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${keyword}&&language=vi-VN`;
};
export const movieDetails = (id: number) => {
  return `https://api.themoviedb.org/3/movie/${id}?api_key=${apikey}&&language=vi-VN`;
};
export const movieCastDetails = (id: number) => {
  return `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apikey}`;
};
export const movieTrailer = (id: number) => {
  return `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apikey}&&language=en-US`;
}