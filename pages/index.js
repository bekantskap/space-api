import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import { useRouter } from "next/router";
import { useQuery, dehydrate, QueryClient } from "react-query";

export async function getStaticProps({}) {
  const [spaceRes, testRes, cartoonRes] = await Promise.all([
    fetch("https://go-apod.herokuapp.com/apod"),
    fetch("https://mockyard.herokuapp.com/products"),
    fetch(`https://rickandmortyapi.com/api/character`),
  ]);

  return {
    props: {
      spacefacts: await spaceRes.json(),
      testproducts: await testRes.json(),
      cartoonRes: await cartoonRes.json(),
    },
  };
}

export default function Home({ spacefacts, testproducts, cartoonRes }) {
  const [pageData, setPageData] = useState([]);
  const router = useRouter();
  const [page, setPage] = useState(parseInt(router.query.page) || 1);
  const colorRng = ["#FAC8CD", "#98B6B1", "#629677", "#495D63"];

  useEffect(() => {
    if (router.query.page) {
      setPage(parseInt(router.query.page));
    }
  }, [router.query.page]);

  const { data } = useQuery(
    ["characters", page],
    async () =>
      await fetch(
        `https://rickandmortyapi.com/api/character/?page=${page}`
      ).then((result) => result.json()),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const handlePageChange = async (e, value) => {
    setPage(value);
    router.push(`/?page=${value}`, undefined, { shallow: true });
  };

  return (
    <div>
      <Head>
        <title>Random Space Facts</title>
        <meta name="description" content="Generate space facts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-screen min-h-screen flex flex-col items-center">
        <section className="flex flex-col items-center">
          <h2>Daily Space Fact:</h2>

          <article className="flex flex-row w-[1000px] h-96 border-2 shadow-xl">
            <img className="h-full" src={spacefacts.hdurl} alt="/" />
            <div>
              <h1 className="text-xl p-2 font-semibold">{spacefacts.title}</h1>
              <div className=" w-full p-2 flex justify-between leading-loose">
                <p className=" font-medium">{spacefacts.copyright}</p>
                <p>{spacefacts.date}</p>
              </div>
              <p className="p-2 text-sm">{spacefacts.explanation}</p>
            </div>
          </article>
        </section>
        <section className="grid grid-cols-4 gap-4 m-auto pt-20 pb-20">
          {data?.results?.map((character) => (
            <article
              key={character.id}
              className="w-64 p-2 flex flex-col items-center text-center transition duration-500 hover:scale-125 hover:bg-pink-400 rounded-lg shadow-xl"
            >
              <img
                src={character.image}
                alt={character.name}
                height={200}
                loading="lazy"
                width={200}
              />
              <div className="text">
                <p className="font-semibold">Name: {character.name}</p>
                <p className="font-semibold">
                  Lives in: {character.location.name}
                </p>
                <p className="font-semibold">Species: {character.species}</p>
                <i className="font-semibold">Id: {character.id} </i>
              </div>
            </article>
          ))}
        </section>
        <Pagination
          count={data?.info.pages}
          variant="outlined"
          color="primary"
          className="pagination"
          page={page}
          onChange={handlePageChange}
        />
        <div className="w-4/5 m-auto">
          <h2 className="leading-8 text-2xl">Test Products</h2>
          <section className="grid grid-cols-4 gap-8">
            {testproducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div className=" w-56 h-80 border-2 shadow-lg transition duration-500 hover:scale-110">
                  <div className="w-full h-3/6 bg-slate-700 transition duration-500 hover:bg-slate-400"></div>
                  <h2 className="p-2 font-semibold">{product.name}</h2>
                  <p className="p-2">{product.price}</p>
                </div>
              </Link>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
