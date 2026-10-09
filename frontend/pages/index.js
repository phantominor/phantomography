// pages/index.js
import Head from 'next/head';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Phantomography</title>
        <meta name="description" content="Phantom 的醫學筆記系統" />
      </Head>
      <div className={styles.page}>
        <h1 className={styles.title}>Phantomography</h1>
        <p className={styles.subtitle}>醫學筆記系統・建置中</p>
        <a href="https://phantominor.vercel.app" className={styles.back}>← 回到 Phantom's Haven</a>
      </div>
    </>
  );
}
