import WishList from "@/components/WishList"
import HeaderBottom from "@/common/components/layouts/HeaderBottom";
import HeaderTop from "@/common/components/layouts/HeaderTop";
import Navigation from "@/common/components/layouts/Navigation";

const Page = () => {
    return (
        <>
            <HeaderTop />
            <HeaderBottom />
            <Navigation />
            <WishList />
        </>
    )
}
export default Page;