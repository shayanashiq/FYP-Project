import Footer from "@/common/components/layouts/FooterMenu";
import HeaderBottom from "@/common/components/layouts/HeaderBottom";
import HeaderTop from "@/common/components/layouts/HeaderTop";
import Navigation from "@/common/components/layouts/Navigation";
import CartDisplay from "@/components/Cart";

const Page = () =>{
    return (
        <>
        <HeaderTop/>
        <HeaderBottom/>
        <Navigation/>
        <CartDisplay/>
        <Footer/>
        </>
    )
}
export default Page;