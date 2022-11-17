import Head from "next/head";
import Link from "next/link";

export async function getStaticProps({ params }) {
  console.log(params.id);
  const res = await fetch(
    `https://mockyard.herokuapp.com/products/${params.id}`
  );

  return {
    props: {
      product: await res.json(),
    },
    revalidate: 30,
  };
}

export async function getStaticPaths({}) {
  const res = await fetch("https://mockyard.herokuapp.com/products");
  const product = await res.json();

  return {
    paths: product.map((product) => ({
      params: { id: product.id.toString() },
    })),
    fallback: false,
  };
}

export default function Products({ product }) {
  console.log(product);
  return (
    <div>
      <Head>
        <title>{product.name}</title>
      </Head>
      <div>
        <Link href="/">Back to home</Link>
      </div>
      <main className="w-screen h-screen">
        <article className="w-3/6 h-4/5">
          <h2>{product.name}</h2>
          <p>{product.price}</p>
          <p>{product.category}</p>
          <p>{product.description}</p>
        </article>
      </main>
    </div>
  );
}
