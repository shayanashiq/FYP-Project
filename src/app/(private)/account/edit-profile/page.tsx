import Footer from "@/common/components/layouts/FooterMenu";
import HeaderBottom from "@/common/components/layouts/HeaderBottom";
import HeaderTop from "@/common/components/layouts/HeaderTop";
import Navigation from "@/common/components/layouts/Navigation";
import EditProfile from "@/components/EdirProfile";

const Page = () =>{
    return (
        <>
        <HeaderTop/>
        <HeaderBottom/>
        <Navigation/>
        <EditProfile/>
        <Footer/>
        </>
    )
}
export default Page;