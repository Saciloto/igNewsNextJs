import Head from "next/head";
import { GetStaticProps } from "next";
import { SubscribeButton } from "../components/SubscribeButton";

import styles from "./home.module.scss";
import { stripe } from "../services/stripe";

//CHAMADAS VIA NEXT PARA POPULAR UMA PAGINA COM INFORMAÇÕES
//  Client-side - Não precisa indexação, ação do usuário
//  Server-side - dados dinamicos da seção do usuário, contexto da requisição,
//  Static Site Generation - PAGINAS COMUNS PARA TODA A APLICAÇÃO, BLOG, posts


//Post do blog post
// Conteudo (SSG)
// Comentarios (Client-side)


//ESTRATÉGIAS DE AUTENTICAÇÃO NEXT
// JSW (Refresh)
// Next Auth (Social, independe de ter um backend )
// Cognito, Auth0


interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home - ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span> React </span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="girl codeing" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1IsTvUDkrtMQ3VD36sq0EuMK", {
    expand: ["product"],
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  };
};
