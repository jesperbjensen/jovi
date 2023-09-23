import { PageProps } from "..";
import Layout from "../components/Layout";

export default async function LoginPage(props: PageProps) {
  const success = await checkLogin(
    props.formParams.username,
    props.formParams.password
  );

  if (success) {
    props.setCookie("loggedIn", "true");
  }

  return (
    <Layout>
      <div>{success ? "JA" : "NEJ"}</div>
    </Layout>
  );
}

function checkLogin(username: string, password: string) {
  if (username === "admin" && password === "admin") {
    return true;
  }

  return false;
}
