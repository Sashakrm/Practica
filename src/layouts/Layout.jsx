import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

function Layout({ children }) {
  return (
    <div className="site-layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
export default Layout;
