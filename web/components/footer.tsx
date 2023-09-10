import styles from "./footer.module.css";

export function Footer() {
  return (
    <div className={styles.wrapper}>
      <div>
        MIT {new Date().getFullYear()} ©&nbsp;
        <a href="https://depold.com" target="_blank">
          Sascha Depold
        </a>
      </div>
      <a
        href="https://vercel.com?utm_source=feedr-app&utm_campaign=oss"
        target="_blank"
        className={styles.link}
      >
        <img
          className={styles.image}
          src="https://images.ctfassets.net/e5382hct74si/78Olo8EZRdUlcDUFQvnzG7/fa4cdb6dc04c40fceac194134788a0e2/1618983297-powered-by-vercel.svg"
        />
      </a>
    </div>
  );
}
