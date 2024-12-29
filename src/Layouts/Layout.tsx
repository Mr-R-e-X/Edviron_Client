import Title from "../shared/Title";
import Header from "./Header";

interface LayoutOpts {
  title?: string;
  description?: string;
}

const Layout = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: LayoutOpts
) => {
  return (props: P & { title?: string; description?: string }) => {
    const title = props.title || options?.title || "EduPayHub";
    const description =
      props.description ||
      options?.description ||
      "Streamlined School Payment and Dashboard System";

    return (
      <>
        <Title title={title} description={description} />
        <Header />
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default Layout;
