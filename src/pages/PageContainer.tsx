import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { PropsWithChildren } from "react";

import styles from "./stylesheets/PageContainer.module.scss";
import { classCombine } from "../utils/utils";

interface PageContainerProps {
  header: string;
  className?: string;
}

export default function PageContainer({
  header,
  className = "",
  children,
}: PropsWithChildren<PageContainerProps>) {
  return (
    <>
      <header className={classCombine(styles.header, className)}>
        <Navigation />
        <h1>{header}</h1>
      </header>
      {children}
      <Footer />
    </>
  );
}
