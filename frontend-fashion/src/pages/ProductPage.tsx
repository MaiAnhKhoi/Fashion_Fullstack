import Products from "@/components/product/Product";
import Breadcumb from "@/components/layoutDashboard/Breadcumb";

export const ProductPage = () => {
    return (
        <>
            <Breadcumb pageName={"Product"} pageTitle={"Product"} />
            <Products />
        </>
    );
}