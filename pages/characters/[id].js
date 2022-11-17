// export async function getStaticPaths({ params }) {
//   const res = await fetch(
//     `https://rickandmortyapi.com/api/character/?page=${params.page}`
//   );
//   const chars = res.json();
//   return {
//     paths: chars.map((char) => ({
//       params: { id: product.id.toString() },
//     })),
//     fallback: false,
//   };
// }
