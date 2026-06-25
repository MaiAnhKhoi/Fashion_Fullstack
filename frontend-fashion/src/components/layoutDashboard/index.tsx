import AccountLayout from "./AccountLayout";
import Breadcumb from "./Breadcumb";
import { useMatches } from "react-router-dom";
interface RouteHandle {
  pageName?: string;
  pageTitle?: string;
}
export const LayoutDashboard = () => {
  const matches = useMatches();

  const currentMatch = matches[matches.length - 1];

  const handle = currentMatch.handle as RouteHandle | undefined;
  return (
    <>
      <Breadcumb
        pageName={handle?.pageName ?? "Account"}
        pageTitle={handle?.pageTitle ?? "My Account"}
      />
      <AccountLayout />
    </>
  );
};
